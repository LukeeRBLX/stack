import { Button, Input, Slider, Typography, buttonVariants } from '@stackframe/stack-ui';
import { Edit } from 'lucide-react';
import { ComponentProps, useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { UserAvatar } from './elements/user-avatar';
import { runAsynchronously } from '@stackframe/stack-shared/dist/utils/promises';
import { useUser } from '..';

async function checkImage(url: string){
  const res = await fetch(url);
  const buff = await res.blob();
  return buff.type.startsWith('image/');
}

function getBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

export function ProfileImageEditor(props: {
  user: NonNullable<ComponentProps<typeof UserAvatar>['user']>,
  onProfileImageUrlChange: (profileImageUrl: string | null) => void,
}) {
  const user = useUser({ or: 'redirect' });
  const cropRef = useRef<AvatarEditor>(null);
  const [slideValue, setSlideValue] = useState(1);
  const [rawUrl, setRawUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setSlideValue(1);
    setRawUrl(null);
    setError(null);
  }

  function upload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      getBase64(file)
        .then(async (rawUrl) => {
          if (await checkImage(rawUrl)) {
            setRawUrl(rawUrl);
            setError(null);
          } else {
            setError('Invalid image');
          }
        })
        .then(() => input.remove())
        .catch(console.error);
    };
    input.click();
  }

  if (!rawUrl) {
    return <div className='flex flex-col'>
      <div className='cursor-pointer relative' onClick={upload}>
        <UserAvatar
          size={100}
          user={props.user}
          border
        />
        <div className='absolute top-0 left-0 h-[100px] w-[100px] bg-gray-500/20 backdrop-blur-sm items-center justify-center rounded-full flex opacity-0 hover:opacity-100 transition-opacity'>
          <div className='bg-background p-2 rounded-full'>
            <Edit className='h-5 w-5' />
          </div>
        </div>
      </div>
      {error && <Typography variant='destructive' type='label'>{error}</Typography>}
    </div>;
  }

  return (
    <div className='flex flex-col items-center gap-4'>
      <AvatarEditor
        ref={cropRef}
        image={rawUrl || props.user.profileImageUrl || ""}
        borderRadius={1000}
        color={[0, 0, 0, 0.72]}
        scale={slideValue}
        rotate={0}
        border={20}
        className='border'
      />
      <Slider
        min={1}
        max={5}
        step={0.1}
        defaultValue={[slideValue]}
        value={[slideValue]}
        onValueChange={(v) => setSlideValue(v[0])}
      />

      <div className='flex flex-row gap-2'>
        <Button
          onClick={async () => {
            if (cropRef.current && rawUrl) {
              const croppedUrl = cropRef.current.getImage().toDataURL('image/jpeg');
              await user.update({
                profileImageUrl: croppedUrl,
              });
              reset();
            }
          }}
        >
          Save
        </Button>
        <Button
          variant="secondary"
          onClick={reset}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}