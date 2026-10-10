"""Scan existing tracked and untracked deliverables; emit paths/lines, never values.

Policy exceptions are contextual: approved Admin default behavior, synthetic tests,
and SQL guards against plaintext storage. Ignored private recovery files are skipped.
This is a source audit, not a claim to detect every possible secret representation.
"""
from pathlib import Path
import json
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[2]
staged = "--staged" in sys.argv[1:]
raw = subprocess.check_output(
    ["git", "ls-files", "--cached", "-z"] if staged else
    ["git", "ls-files", "--cached", "--others", "--exclude-standard", "-z"], cwd=ROOT
)
paths = sorted({p.decode("utf-8") for p in raw.split(b"\0") if p})
private_values = []
for line in (ROOT / ".env").read_text(encoding="utf-8-sig").splitlines():
    match = re.match(r"\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$", line)
    if match and re.search(r"PASSWORD|API_KEY|TOKEN|SECRET|ACCOUNT_NO", match[1]):
        value = match[2].strip().strip("\"'")
        if len(value) >= 4:
            private_values.append(value)
policy_source = (ROOT / "src/main/java/cyan/project/twinkle/admin/AdminUserService.java").read_text(encoding="utf-8")
policy = re.search(r'DEFAULT_PASSWORD\s*=\s*"([^\"]+)"', policy_source).group(1)
patterns = {
    "API token / private key": re.compile(r"gsk_[A-Za-z0-9]{20,}|sk-proj-[A-Za-z0-9_-]{20,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    "Literal browser login credential": re.compile(r"(?:name[=\"']+password|input\[type=password\]).*?\.fill\(\s*['\"]([^'\"]+)['\"]\s*\)"),
    "Literal password comparison": re.compile(r"(?:BCrypt\.checkpw|(?:passwordEncoder|encoder)\.matches)\(\s*['\"]([^'\"]+)['\"]"),
    "Hardcoded credential assignment": re.compile(r"(?i)\b(?:password|passwd|pwd|api[_-]?key|client[_-]?secret)\s*[:=]\s*['\"]([^'\"\r\n]+)['\"]"),
    "Password in connection string": re.compile(r"(?i)(?:jdbc:|Server=|Data Source=).*?(?:password|pwd)\s*=\s*[^;$\s'\"]+"),
}
findings, exceptions = [], []
scanned = 0
for relative in paths:
    path = ROOT / relative
    if not path.is_file():
        continue
    if any(part in {"node_modules", "target", "test-results", "playwright-report", ".git"} for part in path.relative_to(ROOT).parts):
        continue
    try:
        content = (subprocess.check_output(["git", "show", ":" + relative], cwd=ROOT).decode("utf-8-sig")
                   if staged else path.read_text(encoding="utf-8-sig"))
    except (UnicodeError, OSError):
        continue
    scanned += 1
    for number, line in enumerate(content.splitlines(), 1):
        for private in private_values:
            if private in line:
                findings.append({"path": relative, "line": number, "issue": "Local private value present"})
        for label, pattern in patterns.items():
            for match in pattern.finditer(line):
                value = match.group(1) if pattern.groups else ""
                if value and (value.startswith(("${", "YOUR_", "[REDACTED")) or value in {"password", "Password", "synthetic-not-a-credential", "!unusable-test-password"}):
                    exceptions.append({"path": relative, "line": number, "classification": "Placeholder / non-authenticating fixture"})
                    continue
                if relative.startswith("src/test/") and label != "API token / private key":
                    exceptions.append({"path": relative, "line": number, "classification": "Synthetic maintained regression test"})
                    continue
                findings.append({"path": relative, "line": number, "issue": label})
        if policy in line and re.search(r"(?i)password|credential|\.fill\(", line):
            if relative == "src/main/java/cyan/project/twinkle/admin/AdminUserService.java" or relative.startswith("src/test/") or relative.startswith("frontend/admin/src/") or relative.startswith("src/main/resources/static/admin-assets/"):
                exceptions.append({"path": relative, "line": number, "classification": "Approved public default-password policy / regression contract"})
            elif relative.endswith(".sql") and "password_hash=" in line:
                exceptions.append({"path": relative, "line": number, "classification": "Guard rejects plaintext passwords; no login performed"})
            else:
                findings.append({"path": relative, "line": number, "issue": "Baseline login literal outside approved public policy"})
summary = {"status": "FAIL" if findings else "PASS", "scope": "staged index" if staged else "working-tree deliverables", "scanned_text_files": scanned,
           "findings": findings, "classified_exceptions": exceptions}
print(json.dumps(summary, ensure_ascii=True, indent=2))
raise SystemExit(1 if findings else 0)
