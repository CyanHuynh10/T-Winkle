export type Row=Record<string,any>
export type Page={items:Row[];total:number;page:number;size:number}
export function csrf(){return {[document.querySelector<HTMLMetaElement>('meta[name="_csrf_header"]')?.content||'X-CSRF-TOKEN']:document.querySelector<HTMLMetaElement>('meta[name="_csrf"]')?.content||''}}
export async function request<T=Row>(path:string,body?:unknown):Promise<T>{
 const r=await fetch(path,{credentials:'same-origin',method:body===undefined?'GET':'POST',headers:{...csrf(),'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)})
 if(r.redirected||r.status===401)throw Error('Phiên đăng nhập đã kết thúc');if(!r.ok){const e=await r.json().catch(()=>({}));throw Error(e.message||(r.status===403?'Bạn không có quyền thực hiện thao tác này':'Chưa thể xử lý yêu cầu'))}return r.json()
}
