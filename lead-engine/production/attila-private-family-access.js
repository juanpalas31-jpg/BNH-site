/** Server-side access guard. Deny by default. Do not embed secrets in public pages. */
import {createHmac,timingSafeEqual} from 'node:crypto';
const same=(a,b)=>{const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y);};
export function authorizeFamilyRequest(req,{secret=process.env.ATTILA_FAMILY_API_KEY}={}){
 if(typeof secret!=='string'||secret.length<32)return {ok:false,status:503,reason:'FAMILY_ACCESS_NOT_CONFIGURED'};
 const header=req.headers?.['x-attila-family-key'];
 if(typeof header!=='string'||!same(header,secret))return {ok:false,status:401,reason:'UNAUTHORIZED'};
 return {ok:true,status:200};
}
/** Hash a family identifier for server-side audit logs, never as proof of identity. */
export function familyAuditTag(identifier,secret=process.env.ATTILA_AUDIT_SECRET){
 if(typeof secret!=='string'||secret.length<32)throw Error('Audit secret not configured');
 return createHmac('sha256',secret).update(String(identifier)).digest('hex').slice(0,16);
}
