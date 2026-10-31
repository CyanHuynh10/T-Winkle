import { el } from './core.js';
export function cellClass(key) {
  if (/email|customer|manager$|requester|requested_by|reviewed_by|performed_by|actor|responder/.test(key)) return 'tw-cell-email';
  if (['name','product','store','stores','assigned_store','brand','category','full_name'].includes(key)) return 'tw-cell-name';
  if (['comment','response','reason','note','summary','review_note','filter_snapshot','requested_data','file_name'].includes(key)) return 'tw-cell-text';
  if (/price|amount|total|quantity|count|level|limit|priority|adjustment|delta|size_count|color_count/.test(key)) return 'tw-cell-number';
  return 'tw-cell-nowrap';
}
export function tableCell(key, content) {
  const cls=cellClass(key), cell=el('td', {class:cls,'data-column':key});
  if (cls==='tw-cell-name' || cls==='tw-cell-text') {
    const full=content instanceof Node ? content.textContent : String(content ?? '—');
    // Keyboard focus exposes the same full text as the mouse title, and details retain it.
    cell.append(el('span',{class:'tw-cell-content',title:full,tabindex:0,'aria-label':full},content));
  } else cell.append(content instanceof Node ? content : document.createTextNode(String(content ?? '—')));
  return cell;
}
export function rowActions(...children) {
  return el('details',{class:'tw-row-actions',open:true},el('summary',{class:'btn btn-sm btn-outline-secondary','aria-label':'Thao tác trên dòng'},'Thao tác'),el('div',{class:'console-actions'},...children));
}
export function compactActions(group) {
  if (matchMedia('(max-width:575.98px)').matches) group.open=false;
  return group;
}
export function dateTime(value) {
  const date=new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  const parts=Object.fromEntries(new Intl.DateTimeFormat('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(date).map(part=>[part.type,part.value]));
  return `${parts.day}/${parts.month}/${parts.year} ${parts.hour}:${parts.minute}`;
}
export function quantityCell(key,value,row,area,role) {
  if (!['inventory','variants'].includes(area)) return null;
  if (key==='availability') return el('span',{class:'tw-stock-badge tw-stock-'+row.availability_style},row.availability);
  if (key!=='quantity') return null;
  const tracked=role==='admin' || area==='inventory' || row.inventory_store_id!=null;
  return el('span',{},tracked ? String(value ?? '—') : '—');
}
const actionViewport=matchMedia('(max-width:575.98px)');
actionViewport.addEventListener('change',event=>{
  document.querySelectorAll('.tw-row-actions').forEach(group=>{group.open=!event.matches;});
});
