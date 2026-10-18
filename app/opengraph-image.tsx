import { ImageResponse } from 'next/og'
export const dynamic='force-static'
export const alt='Copero – Free football career simulator'
export const size={width:1200,height:630}
export const contentType='image/png'
export default function OpenGraphImage(){return new ImageResponse(<div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',justifyContent:'center',padding:'64px 82px',background:'#153f32',color:'#f4f5e9',fontFamily:'Arial'}}><div style={{display:'flex',fontSize:40,fontWeight:900,color:'#d5ec80',marginBottom:38}}>copero.</div><div style={{display:'flex',fontSize:82,lineHeight:1.05,fontWeight:900}}>Your career.</div><div style={{display:'flex',fontSize:82,lineHeight:1.05,fontWeight:900,color:'#d5ec80'}}>Your call.</div><div style={{display:'flex',fontSize:25,marginTop:34,color:'#c1d0b9'}}>Free football career simulator · No account · Play online</div><div style={{display:'flex',fontSize:23,marginTop:26,color:'#d5ec80'}}>copero.pro</div></div>,size)}
