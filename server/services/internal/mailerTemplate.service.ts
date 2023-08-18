import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import matter from 'gray-matter';
import Handlebars from 'handlebars';
import Maizzle from '@maizzle/framework';
// @ts-expect-error untyped module import
import markdownPlugin from 'markdown-it-attrs';
import { emailTemplatePayloadSchema, emailTemplateKeySchema } from '@/server/dto/system/mailer.dto';

const EMAILS_SOURCE_PATH = fileURLToPath(new URL('../../emails', import.meta.url));

export async function compileEmailTemplate(params: z.infer<typeof emailTemplatePayloadSchema>) {
  const rawTemplate = getRawTemplate(params.type);
  const { title, text } = getTemplateMeta(rawTemplate);

  const tailwindConfig = await getTailwindConfig();
  const tailwindBaseCss = getBaseMaizzleCss();

  const { html } = await Maizzle.render(rawTemplate, {
    tailwind: {
      config: tailwindConfig,
      css: tailwindBaseCss,
    },
    maizzle: {
      prettify: true,
      build: {
        components: {
          root: EMAILS_SOURCE_PATH,
        },
      },
      markdown: {
        plugins: [{ plugin: markdownPlugin }],
      },
    },
    beforeRender(html) {
      const { content, data } = matter(html);
      const layout = data?.layout || 'main';

      return `
          <x-${layout}>
            <fill:template>
              <md>${content}</md>
            </fill:template>
          </x-${layout}>`;
    },
  });

  return {
    html: renderHandlebars(html, params.params),
    text: renderHandlebars(text || 'ERROR: TEXT COULD NOT BE RENDERED', params.params),
    subject: renderHandlebars(title || 'ERROR: TITLE COULD NOT BE RENDERED', params.params),
  };
}

function getBaseMaizzleCss() {
  const markdown = fs.readFileSync(path.join(EMAILS_SOURCE_PATH, 'src/css/markdown.css'), 'utf8');
  const utilities = fs.readFileSync(path.join(EMAILS_SOURCE_PATH, 'src/css/utilities.css'), 'utf8');

  return `
    ${markdown}
    ${utilities}`;
}

async function getTailwindConfig() {
  return (await import(path.join(EMAILS_SOURCE_PATH, 'tailwind.config.js'))).default;
}

function getRawTemplate(templateKey: z.infer<typeof emailTemplateKeySchema>) {
  const FILE_URL = path.join(EMAILS_SOURCE_PATH, `src/content/${templateKey}.md`);
  return fs.readFileSync(FILE_URL, 'utf8');
}

function renderHandlebars(templateString: string, templateData: Record<string, any>) {
  return Handlebars.compile(templateString)(templateData);
}

function getTemplateMeta(rawTemplate: string): Record<string, string> {
  if (!rawTemplate.startsWith('---')) return {};
  const [, meta] = rawTemplate.split('---');
  const metaObject = meta
    .split('\n')
    .filter((line) => line)
    .reduce((acc, line) => {
      const [key, value] = line.split(':');
      return { ...acc, [key]: value };
    }, {});
  return metaObject;
}
