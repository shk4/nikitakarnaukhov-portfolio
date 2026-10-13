"""Adapt vector presentation chrome while retaining original product controls."""
from pathlib import Path
import xml.etree.ElementTree as E
import json, re

ROOT=Path(__file__).resolve().parents[2]
NS='http://www.w3.org/2000/svg'
E.register_namespace('',NS)
out={}
for p in sorted((ROOT/'app/atlas').glob('*.svg')):
    svg=E.parse(p).getroot()
    children=list(svg)
    children[0].set('fill','#131414')
    # Only charcoal tertiary controls require a light demonstration surface.
    # Keep its padding compact; breadcrumbs and upload need no extra panel.
    backing=[(322,517,867,72)] if p.name=='01-buttons.svg' else []
    for e in children[1:]:
        if e.tag.split('}')[-1]=='rect':
            x,y=float(e.get('x',0)),float(e.get('y',0))
            if p.name in ['01-buttons.svg','02-input.svg'] and x>=1270 and y>=306 and y<805:
                if e.get('fill','').upper() in ['#FFFFFF','#F0F2F4','#ECEEEF','#F1F1F1','#F0F0F0','#F0F1F3']:
                    e.set('fill','#202320' if x==1270 else '#30352e')
                    if x==1270:e.set('stroke','#41483e')
            if p.name=='07-color-picker.svg' and ((x==1085 and y in [256,504]) or (x>1000 and e.get('fill','').upper()=='#FFFFFF')):
                e.set('fill','none');e.set('stroke','none')
    for x,y,w,h in backing:
        svg.insert(1,E.Element('{'+NS+'}rect',{'x':str(x),'y':str(y),'width':str(w),'height':str(h),'rx':'12','fill':'#f5f6f4'}))
    painted=[(x,y,w,h) for x,y,w,h in backing]
    for e in children[1:]:
        tag=e.tag.split('}')[-1]
        if tag=='rect' and e.get('fill','none') not in ['none','transparent'] and e.get('opacity','1')=='1':
            painted.append(tuple(float(e.get(k,0)) for k in ['x','y','width','height']))
        if tag=='text':
            x,y=float(e.get('x',0)),float(e.get('y',0))-6
            on_control=any(a<=x<=a+w and b<=y<=b+h for a,b,w,h in painted)
            mono='Mono' in e.get('font-family','')
            e.set('font-family','DiscountMono, monospace' if mono else 'DiscountGolos, sans-serif')
            if not on_control:
                old=e.get('fill','').upper()
                e.set('fill','#f0f0e9' if old in ['#202735','#424958','#353535'] else '#a2a5a0' if old in ['#737B89','#73818C','#CFD2D5'] else e.get('fill','#f0f0e9'))
            if p.name in ['01-buttons.svg','02-input.svg'] and x>=1270 and 306<=y<805:
                if e.get('fill','').upper() in ['#202735','#424958','#353535','#737B89','#73818C']:
                    e.set('fill','#a2a5a0' if mono else '#f0f0e9')
            if float(e.get('y',0))==53 and float(e.get('x',0))==84:e.set('fill','#d9ff62')
            if float(e.get('y',0))==151 and float(e.get('x',0))==84:e.set('font-weight','500');e.set('letter-spacing','-1.5')
        if tag=='path' and e.get('stroke','').upper()=='#CFD2D5':e.set('stroke','#383b37')
        if tag=='g' and p.name in ['01-buttons.svg','02-input.svg']:
            pos=re.search(r'translate\((\d+)[ ,]+(\d+)',e.get('transform',''))
            if pos and float(pos[1])>1270 and 306<float(pos[2])<805:
                for part in e.iter():
                    if part.get('fill','').upper() in ['#424958','#202735']:part.set('fill','#f0f0e9')
    # Insets apply to the demonstration stage, not the header/footer typography.
    stage=E.Element('{'+NS+'}g',{'transform':'translate(90 60) scale(.9)'})
    for e in list(svg):
        tag=e.tag.split('}')[-1]
        y=float(e.get('y','0')) if tag=='text' else 0
        chrome=(e is children[0] or tag=='defs' or
                (tag=='text' and (y in [53,151,190,1080])) or
                (tag=='path' and e.get('d','') in ['M84 75L1716 75','M84 1050L1716 1050']))
        if not chrome:svg.remove(e);stage.append(e)
    # Purple outlines describe the props selection only, not every specimen.
    for e in list(stage):
        if e.tag.split('}')[-1]=='rect' and e.get('stroke','').upper() in ['#9860FF','#A259FF']:
            if p.name not in ['01-buttons.svg','02-input.svg']:
                stage.remove(e)
            else:
                for k,d in [('x',-8),('y',-8),('width',16),('height',16)]:e.set(k,str(float(e.get(k,0))+d))
    svg.append(stage)
    svg.set('width','1800');svg.set('height','1125')
    out['ds-'+p.name[:2].lstrip('0')+'.webp']=E.tostring(svg,encoding='unicode')
(ROOT/'app/atlas-vectors.json').write_text(json.dumps(out,ensure_ascii=False))
