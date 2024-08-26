import { Button, Input, Slider } from '@stackframe/stack-ui';
import { Edit } from 'lucide-react';
import { ComponentProps, useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { UserAvatar } from './elements/user-avatar';

export function ProfileImageEditor(props: {
  user: NonNullable<ComponentProps<typeof UserAvatar>['user']>,
  onProfileImageUrlChange: (profileImageUrl: string | null) => void,
}) {
  const cropRef = useRef<AvatarEditor>(null);
  const [slideValue, setSlideValue] = useState(1);
  const [editing, setEditing] = useState(false);

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

  if (!props.user.profileImageUrl) {
    return <div className='flex flex-col md:flex-row gap-2'>
      <Input type='file' />
      <Button>Upload</Button>
      <Button variant='secondary'>Cancel</Button>
    </div>;
  }

  return (
    <div className='flex flex-col items-center gap-4'>
      <AvatarEditor
        ref={cropRef}
        image={props.user.profileImageUrl || ""}
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
          variant="secondary"
          onClick={() => setEditing(false)}
        >
          Cancel
        </Button>
        <Button
        // onClick={handleSave}
        >
          Save
        </Button>
      </div>
    </div>
  );
}