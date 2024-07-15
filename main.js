import {
    ClassicEditor,
    AutoLink,
    Autosave,
    Bold,
    Essentials,
    Italic,
    Link,
    List,
    ListProperties,
    Mention,
    Paragraph,
    SelectAll,
    Strikethrough,
    Underline,
    Undo
} from 'ckeditor5';
import MentionCustomization from './mention-customize';

import 'ckeditor5/ckeditor5.css';
import './style.css';

const editorConfig = {
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
        ],
        shouldNotGroupWhenFull: false
    },
    plugins: [
        AutoLink,
        Autosave,
        Bold,
        Essentials,
        Italic,
        Link,
        List,
        ListProperties,
        Mention,
        MentionCustomization,
        Paragraph,
        SelectAll,
        Strikethrough,
        Underline,
        Undo
    ],
    // link: {
    //     addTargetToExternalLinks: true,
    //     defaultProtocol: 'https://',
    //     decorators: {
    //         toggleDownloadable: {
    //             mode: 'manual',
    //             label: 'Downloadable',
    //             attributes: {
    //                 download: 'file'
    //             }
    //         }
    //     }
    // },
    // list: {
    //     properties: {
    //         styles: true,
    //         startIndex: true,
    //         reversed: true
    //     }
    // },
    mention: {
        dropdownLimit: Infinity,
        feeds: [
            {
                marker: '@',
                feed: _getFeedItems,
                itemRenderer: _customItemRenderer
            }
        ]
    }
};

ClassicEditor.create(document.querySelector('#editor'), editorConfig)
    .then(editor => {
        window.editor = editor;

        editor.model.document.on('change:data', () => {
            if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(editor.getData());

            // _postDataMentions(editor.getData());
        });

        editor.editing.view.document.on('change:isFocused', (evt, name, value) => {
            if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage('MobileCkeditor:onFocus' + value);
        });
    })
    .catch(error => {
        console.error(error);
    });

let mentions = [];
// let mentions = [
//     {
//         userId: 0,
//         id: '@Group',
//         name: 'Group',
//         avatar: 'https://d353sipp6elw65.cloudfront.net/1000/small/5b887a46-a111-4870-acd2-90f3969c9313.png',
//         link: 'https://www.imdb.com/title/tt0460649/characters/nm0000439',
//         isGroup: true
//     },
//     {
//         userId: 1,
//         id: '@Barney',
//         name: 'Barney Stinson',
//         avatar: '',
//         link: 'https://www.imdb.com/title/tt0460649/characters/nm0000439',
//     },
//     {
//         userId: 2,
//         id: '@Lily',
//         name: 'Lily Aldrin',
//         avatar: 'https://d353sipp6elw65.cloudfront.net/1000/small/5b887a46-a111-4870-acd2-90f3969c9313.png',
//         link: 'https://www.imdb.com/title/tt0460649/characters/nm0004989',
//     }];

function _setMentions(data) {
    mentions = (data || [])
        .filter(item => !!item)
        .map(item => ({...item, userId: item.id, id: item.text, avatar: item.avatar || 'user-default.png'}));
}

function _getFeedItems(term) {
    if (!term || !mentions) return mentions;

    const searchText = _ignoreUnicode(term);

    return mentions.filter(item => item && item.name && _ignoreUnicode(item.name).includes(searchText));
}

function _ignoreUnicode(str, toLower = true) {
    if (!str) return str;

    str = str.trim();
    if (toLower) str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(
        /!|@|%|\^|\*|\(|\)|\+|=|<|>|\?|\/|,|\.|:|;|'|"|&|#|\[|\]|~|$|_/g,
        '-'
    );

    str = str.replace(/-+-/g, '-');
    str = str.replace(/^-+|-+$/g, '');

    return str;
}

function _customItemRenderer(item) {
    const itemElement = document.createElement('div');
    if (!item) return itemElement;

    itemElement.classList.add('mce-mention-item');
    itemElement.id = `mce-mention-item-id-${item.id}`;

    const imageElement = document.createElement('img');
    imageElement.classList.add('mce-mention-avatar');
    imageElement.src = `${item.avatar}`;
    itemElement.appendChild(imageElement);

    const nameElement = document.createElement('div');
    nameElement.classList.add('mce-mention-name');
    nameElement.textContent = `${item.name}`;
    itemElement.appendChild(nameElement);

    return itemElement;
}

function _postDataMentions(data) {
    let msg = '';

    if (data && data.includes('<a') && data.includes('</a>')) {
        const el = document.createElement('html');
        el.innerHTML = data;

        let mentionUsers = Array.prototype.filter
            .call(
                el.getElementsByTagName('a'),
                (link) =>
                    link?.getAttribute('href') &&
                    link?.getAttribute('data-mention') &&
                    link?.getAttribute('userid') &&
                    link?.getAttribute('data-type') === 'mention' &&
                    link?.getAttribute('data-mention-group') === 'false'
            )
            .map((link) => link?.getAttribute('userid'));

        // Distinct
        mentionUsers = mentionUsers.filter((user, index) => mentionUsers.findIndex((u) => user === u) === index);

        let mentionGroups = Array.prototype.filter
            .call(
                el.getElementsByTagName('a'),
                (link) =>
                    link?.getAttribute('href') &&
                    link?.getAttribute('data-mention') &&
                    link?.getAttribute('userid') &&
                    link?.getAttribute('data-type') === 'mention' &&
                    link?.getAttribute('data-mention-group') === 'true'
            )
            .map((link) => link?.getAttribute('userid'));

        // Distinct
        mentionGroups = mentionGroups.filter((group, index) => mentionGroups.findIndex((g) => group === g) === index);

        msg = JSON.stringify({mentionUsers, mentionGroups});
    }

    if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage('MobileCkeditor:dataMentions:' + msg);

    return msg;
}

window.setMentions = _setMentions;
window.getDataMentions = () => _postDataMentions(window.editor.getData())
