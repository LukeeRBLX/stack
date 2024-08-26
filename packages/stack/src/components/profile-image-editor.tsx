import { Button, Slider } from '@stackframe/stack-ui';
import { useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { UserAvatar } from './elements/user-avatar';
import { User } from '..';

export function ProfileImageEditor(props: {
  user: User,
  onProfileImageUrlChange: (profileImageUrl: string | null) => void,
}) {
  const cropRef = useRef<AvatarEditor>(null);
  const [slideValue, setSlideValue] = useState(1);
  const [editing, setEditing] = useState(false);

  if (!editing) {
    return <div className='flex flex-col items-center'>
      <UserAvatar
        size={150}
        user={props.user}
      />
      <Button onClick={() => setEditing(true)}>Edit</Button>
    </div>;
  }

  return (
    <div className='flex flex-col items-center'>
      <AvatarEditor
        ref={cropRef}
        image={props.user.profileImageUrl || ""}
        borderRadius={150}
        color={[0, 0, 0, 0.72]}
        scale={slideValue}
        rotate={0}
        border={20}
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
        // onClick={() => setOpen(false)}
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