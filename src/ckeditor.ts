/**
 * @license Copyright (c) 2014-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// @ts-ignore
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';

// @ts-ignore
import { Bold, Italic, Strikethrough, Underline } from '@ckeditor/ckeditor5-basic-styles';
// @ts-ignore
import type { EditorConfig } from '@ckeditor/ckeditor5-core';
// @ts-ignore
import { Essentials } from '@ckeditor/ckeditor5-essentials';
// @ts-ignore
import { AutoLink, Link } from '@ckeditor/ckeditor5-link';
// @ts-ignore
import { List, ListProperties } from '@ckeditor/ckeditor5-list';
// @ts-ignore
import { Mention } from '@ckeditor/ckeditor5-mention';
// @ts-ignore
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
// @ts-ignore
import { SelectAll } from '@ckeditor/ckeditor5-select-all';
// @ts-ignore
import { Undo } from '@ckeditor/ckeditor5-undo';

import MentionCustomize from './mention-customize';

// You can read more about extending the build with additional plugins in the "Installing plugins" guide.
// See https://ckeditor.com/docs/ckeditor5/latest/installation/plugins/installing-plugins.html for details.

class Editor extends ClassicEditor {
	// @ts-ignore
	public static override builtinPlugins = [
		AutoLink,
		Bold,
		Essentials,
		Italic,
		Link,
		List,
		ListProperties,
		Mention,
		MentionCustomize,
		Paragraph,
		SelectAll,
		Strikethrough,
		Underline,
		Undo
	];

	// @ts-ignore
	public static override defaultConfig: EditorConfig = {
		toolbar: {
			items: [
				'bold',
				'italic',
				'underline',
				'strikethrough',
				'|',
				'bulletedList',
				'numberedList',
				'link',
				'|',
				'undo',
				'redo'
			]
		},
		language: 'en'
	};
}

export default Editor;
