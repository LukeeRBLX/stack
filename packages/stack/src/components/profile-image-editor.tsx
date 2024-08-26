import { Button, Input, Slider } from '@stackframe/stack-ui';
import { Edit } from 'lucide-react';
import { ComponentProps, useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { UserAvatar } from './elements/user-avatar';
import { runAsynchronously } from '@stackframe/stack-shared/dist/utils/promises';

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
  const cropRef = useRef<AvatarEditor>(null);
  const [slideValue, setSlideValue] = useState(1);
  const [editing, setEditing] = useState(false);
  const [url, setUrl] = useState<string | null>(null);

  function reset() {
    setEditing(false);
    setSlideValue(1);
    setUrl(null);
  }

  function upload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      getBase64(file)
        .then(setUrl)
        .then(() => input.remove())
        .catch(console.error);
    };
    input.click();
  }


  if (!editing) {
    return <div className='relative flex'>
      <UserAvatar
        size={100}
        user={props.user}
      />
      <Button className='absolute top-0 right-0' variant='ghost' size='icon' onClick={() => setEditing(true)}>
        <Edit className='h-5 w-5' />
      </Button>
    </div>;
  }

  if (!props.user.profileImageUrl && !url) {
    return <div className='flex flex-col md:flex-row gap-2'>
      <Button
        onClick={upload}
      >
        Update Profile Image
      </Button>
      <Button
        variant='secondary'
        onClick={reset}
      >
        Cancel
      </Button>
    </div>;
  }

  return (
    <div className='flex flex-col items-center gap-4'>
      <AvatarEditor
        ref={cropRef}
        image={url || props.user.profileImageUrl || ""}
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
      <Button onClick={upload} variant='outline'>
        Update a new image
      </Button>

      <div className='flex flex-row gap-2'>
        <Button
          onClick={async () => {
            if (!url) return;

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