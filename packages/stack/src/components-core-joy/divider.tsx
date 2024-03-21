'use client';

import { DividerProps } from "../components-core";
import { Divider as JoyDivider } from '@mui/joy';

export default function Divider(props : DividerProps) {
  const { direction, ref, ...validProps } = props;
  return <JoyDivider {...validProps} orientation={direction} />;
}