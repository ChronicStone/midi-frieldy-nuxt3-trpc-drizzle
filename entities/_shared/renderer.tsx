import { Tag, NImage } from '#components';

export function renderBoolean(value: boolean, mode: 'tag' | 'icon' = 'icon') {
  if (mode === 'icon')
    return (
      <span
        class={`iconify ${value ? 'text-green-500' : 'text-red-500'}`}
        data-icon={value ? 'mdi:check-circle-outline' : 'mdi:close-circle-outline'}
      />
    );
  else
    return (
      <Tag class="w-fit" type={value ? 'warning' : 'success'}>
        {value ? 'No' : 'Yes'}
      </Tag>
    );
}

export function renderImage(image?: string) {
  return image ? <NImage src={image} height={20} /> : <i>N/A</i>;
}

export function renderTypedValue(value: string | number | boolean | undefined) {
  if (typeof value === 'string') return <span>{value}</span>;
  else if (typeof value === 'number') return <span>{value}</span>;
  else if (typeof value === 'boolean') return <span>{value ? 'True' : 'False'}</span>;
  return 'N/A';
}
