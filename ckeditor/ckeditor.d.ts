/**
 * @license Copyright (c) 2014-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { Bold, Italic, Strikethrough, Underline } from '@ckeditor/ckeditor5-basic-styles';
import type { EditorConfig } from '@ckeditor/ckeditor5-core';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { AutoLink, Link } from '@ckeditor/ckeditor5-link';
import { List, ListProperties } from '@ckeditor/ckeditor5-list';
import { Mention } from '@ckeditor/ckeditor5-mention';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { SelectAll } from '@ckeditor/ckeditor5-select-all';
import { Undo } from '@ckeditor/ckeditor5-undo';
import MentionCustomization from './mention-customize';
declare class Editor extends ClassicEditor {
    static builtinPlugins: (typeof AutoLink | typeof Bold | typeof Essentials | typeof Italic | typeof Link | typeof List | typeof ListProperties | typeof Mention | typeof MentionCustomization | typeof Paragraph | typeof SelectAll | typeof Strikethrough | typeof Underline | typeof Undo)[];
    static defaultConfig: EditorConfig;
}
export default Editor;
