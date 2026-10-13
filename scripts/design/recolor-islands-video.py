"""Re-matte the moving panel background; keep enclosed UI pixels unchanged."""
from pathlib import Path
import subprocess, numpy as np
from scipy import ndimage
from PIL import Image
ROOT=Path(__file__).resolve().parents[2]
W,H=2560,1200
BG=np.array([217,222,228],dtype=np.float32)
PANEL=np.array([242,246,248],dtype=np.float32)
TARGET=np.array([48,51,50],dtype=np.float32)
(ROOT/'outputs/motion').mkdir(parents=True,exist_ok=True)
v=PANEL-BG
reader=subprocess.Popen(['ffmpeg','-v','error','-i',str(ROOT/'public/media/settings-islands-equal-gaps-2k.mp4'),'-f','rawvideo','-pix_fmt','rgb24','pipe:1'],stdout=subprocess.PIPE)
writer=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r','30','-i','pipe:0','-an','-c:v','libx264','-preset','medium','-crf','17','-threads','4','-pix_fmt','yuv420p','-movflags','+faststart',str(ROOT/'public/media/settings-islands-studio-2k.mp4')],stdin=subprocess.PIPE)
for i in range(720):
 raw=reader.stdout.read(W*H*3)
 if len(raw)!=W*H*3:raise RuntimeError(f'Short frame {i}')
 frame=np.frombuffer(raw,np.uint8).reshape(H,W,3).astype(np.float32)
 alpha=np.sum((frame-BG)*v,axis=2)/np.sum(v*v)
 residual=np.max(np.abs(frame-(BG+alpha[:,:,None]*v)),axis=2)
 eligible=(alpha<.94)&(alpha>-.25)&(residual<5)
 labels,n=ndimage.label(eligible)
 # Require a large, genuinely background-colored core. Gray controls are enclosed
 # by opaque panels and have no such core, so they are never recolored.
 counts=np.bincount(labels.ravel(),weights=(alpha<.10).ravel());counts[0]=0
 mask=counts[labels]>10000
 # Include antialiased panel edges while protecting the opaque panel interior.
 mask=ndimage.binary_dilation(mask,iterations=1)&(residual<7)&(alpha<1)
 a=np.clip(alpha,0,1)
 a[a<.10]=0
 frame[mask]-=(1-a[mask,None])*(BG-TARGET)
 out=np.clip(np.rint(frame),0,255).astype(np.uint8)
 writer.stdin.write(out.tobytes())
 if i in (0,240,480):Image.fromarray(out).save(ROOT/f'outputs/motion/islands-studio-{i}.png')
 if i==0:Image.fromarray(out).save(ROOT/'public/media/settings-islands-studio-poster.png')
 if i%120==0:print(f'{i}/720',flush=True)
writer.stdin.close()
assert writer.wait()==0 and reader.wait()==0
