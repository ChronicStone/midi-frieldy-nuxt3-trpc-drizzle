import { buildFieldSchema } from '@chronicstone/vue-sweettools';
import { NDivider } from '#components';

export function formDivider(text?: string) {
  return buildFieldSchema({
    key: '#divider#',
    type: 'info',
    content: () => (text ? <NDivider>{text}</NDivider> : <NDivider />),
  });
}

export function formSectionTitle({
  title,
  size = 8,
  topPadding = false,
}: {
  title: string;
  size?: number | string;
  topPadding?: boolean;
}) {
  return buildFieldSchema({
    type: 'info',
    key: '#section-title#',
    size,
    content: () => (
      <div class={topPadding && 'pt-8'}>
        <div class="text-lg font-semibold mb-4">{title}</div>
        <NDivider class={`!m-0`} />
      </div>
    ),
  });
}
