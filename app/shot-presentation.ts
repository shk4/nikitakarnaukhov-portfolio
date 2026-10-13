import type { CSSProperties } from "react";

// Presentation masks preserve every pixel of the original 4K interface exports.
// Browser geometry comes from the source frames; laptop paths follow the casing.
const paths: Record<string, {viewBox:string; shape:string; background?:string; crop?:[number,number,number,number]}> = {
  "settings-noise.webp": {viewBox:"0 0 2048 1045.87",shape:'<rect x="77" y="77" width="791" height="893" rx="38"/><rect x="945" y="77" width="1026" height="893" rx="38"/>',background:"#303332"},
  "shot-01.webp": {viewBox:"0 0 1800 1200",shape:'<rect x="50" y="50" width="1700" height="1100" rx="17"/>'},
  "shot-06.webp": {viewBox:"0 0 1800 1200",shape:'<rect x="50" y="50" width="1700" height="1100" rx="17"/>'},
  "shot-09.webp": {viewBox:"0 0 1800 1200",shape:'<rect x="50" y="50" width="1700" height="1100" rx="17"/>'},
  "shot-03.webp": {viewBox:"0 0 1800 1200",shape:'<rect x="-550" y="76" width="2240" height="1260" rx="14"/>',background:"#303332"},
  "shot-02.webp": {viewBox:"0 0 1920 1280",shape:'<path d="M0 188H1704Q1781 188 1784 260L1793 1280H0Z"/>',crop:[0,188,1793,1092]},
  "shot-08.webp": {viewBox:"0 0 1920 1280",shape:'<path d="M0 48H1754Q1834 48 1834 128V1280H0Z"/>',crop:[0,48,1834,652]},
  "settings-structure.webp": {viewBox:"0 0 2048 1239.5",shape:'<path d="M0 130H1818Q1901 130 1903 214L1913 1239.5H0Z"/>',crop:[0,130,1913,1109.5]},
};
const laptop = {viewBox:"0 0 1920 1280",shape:'<path d="M174 117H1744Q1807 117 1807 176V1107H1903V1135Q1850 1161 1752 1162H167Q65 1161 17 1135V1107H113V176Q113 117 174 117Z"/>'};
for (const file of ["shot-04.webp","shot-05.webp","shot-10.webp"]) paths[file]=laptop;

export function shotPresentation(url:string): {surface:CSSProperties;image:CSSProperties}|undefined {
  const config=paths[url.split("/").pop() || ""];
  if (!config) return;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${config.viewBox}" preserveAspectRatio="none">${config.shape}</svg>`;
  const mask=`url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  const surface:CSSProperties={background:config.background || "var(--paper)"};
  const image:CSSProperties={maskImage:mask,WebkitMaskImage:mask,maskSize:"100% 100%",WebkitMaskSize:"100% 100%",maskRepeat:"no-repeat",WebkitMaskRepeat:"no-repeat"};
  if(config.crop){
    const [x,y,width,height]=config.crop;
    const [, ,sourceWidth,sourceHeight]=config.viewBox.split(" ").map(Number);
    Object.assign(surface,{position:"relative",aspectRatio:`${width} / ${height}`});
    Object.assign(image,{position:"absolute",maxWidth:"none",width:`${sourceWidth/width*100}%`,height:`${sourceHeight/height*100}%`,left:`${-x/width*100}%`,top:`${-y/height*100}%`,borderRadius:0});
  }
  return {surface,image};
}
