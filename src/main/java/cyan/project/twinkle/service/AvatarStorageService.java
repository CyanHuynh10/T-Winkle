package cyan.project.twinkle.service;

import cyan.project.twinkle.exception.BusinessRuleException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import javax.imageio.ImageIO;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;
import java.util.UUID;

@Service
public class AvatarStorageService {
    private final Path directory;

    public AvatarStorageService(@Value("${app.avatar-directory:uploads/avatars}") String directory) {
        this.directory = Path.of(directory).toAbsolutePath().normalize();
    }

    public String store(MultipartFile file) {
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new BusinessRuleException("Ảnh đại diện tối đa 5 MB.");
        }
        try {
            byte[] bytes = file.getBytes();
            try (var input = ImageIO.createImageInputStream(new ByteArrayInputStream(bytes))) {
                var readers = ImageIO.getImageReaders(input);
                if (!readers.hasNext()) throw new BusinessRuleException("Ảnh đại diện phải là ảnh PNG hoặc JPEG hợp lệ.");
                var reader = readers.next();
                try {
                    String format = reader.getFormatName().toLowerCase(Locale.ROOT);
                    if (!format.equals("png") && !format.equals("jpeg")) {
                        throw new BusinessRuleException("Chỉ hỗ trợ ảnh PNG hoặc JPEG.");
                    }
                    reader.setInput(input);
                    int width = reader.getWidth(0), height = reader.getHeight(0);
                    if (width < 1 || height < 1 || width > 4096 || height > 4096) {
                        throw new BusinessRuleException("Kích thước ảnh tối đa 4096 × 4096.");
                    }
                    var decoded = reader.read(0);
                    Files.createDirectories(directory);
                    String name = UUID.randomUUID() + (format.equals("png") ? ".png" : ".jpg");
                    Path target = directory.resolve(name);
                    // Re-encode actual image pixels; discard arbitrary client metadata/content.
                    if (!ImageIO.write(decoded, format, target.toFile())) throw new IOException("Unsupported image writer");
                    if (TransactionSynchronizationManager.isSynchronizationActive()) {
                        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                            @Override
                            public void afterCompletion(int status) {
                                if (status != STATUS_COMMITTED) {
                                    try { Files.deleteIfExists(target); } catch (IOException ignored) { }
                                }
                            }
                        });
                    }
                    return "/uploads/avatars/" + name;
                } finally { reader.dispose(); }
            }
        } catch (IOException ex) {
            throw new BusinessRuleException("Không thể lưu ảnh đại diện. Vui lòng thử lại.");
        }
    }
}
