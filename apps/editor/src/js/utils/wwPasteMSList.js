import toArray from 'tui-code-snippet/collection/toArray';

import domUtils from './dom';

const MS_CLASS_NAME_LIST_RX = /MsoListParagraph/;
const MS_CLASS_NAME_P_RX = /MsoNormal/;
const MS_LIST_STYLE_RX = /mso-list:(.*)/;
const ORDERED_LIST_BULLET_RX = /^[0-9]*\./;

function getContents(pTag) {
  let html = '';

  toArray(pTag.children).forEach((childNode, index) => {
    if (index) {
      html += childNode.outerHTML;
    }
  });

  return html;
}

function getListItemDefaultData(pTag, index) {
  const styleAttr = pTag.getAttribute('style');
  const [, listItemInfo] = styleAttr.match(MS_LIST_STYLE_RX);
  const [, levelStr] = listItemInfo.split(' ');
  const level = parseInt(levelStr.replace('level', ''), 10);
  const orderedListItem = ORDERED_LIST_BULLET_RX.test(pTag.textContent);

  return {
    id: index,
    level,
    parent: null,
    children: [],
    prev: null,
    orderedListItem,
    contents: getContents(pTag)
  };
}

function adjustListItemData(data, prevData) {
  if (prevData.level < data.level) {
    prevData.children.push(data);
    data.parent = prevData;
  } else {
    while (prevData) {
      if (prevData.level === data.level) {
        break;
      }
      prevData = prevData.parent;
    }

    if (prevData) {
      data.prev = prevData;
      data.parent = prevData.parent;

      if (data.parent) {
        data.parent.children.push(data);
      }
    }
  }
}

function createListData(pTags) {
  const listData = [];

  pTags.forEach((pTag, index) => {
    const prevListItemData = listData[index - 1];
    const listItemData = getListItemDefaultData(pTag, index);

    if (prevListItemData) {
      adjustListItemData(listItemData, prevListItemData);
    }

    listData.push(listItemData);
  });

  return listData;
}

function createListElement(list) {
  const listTagName = list[0].orderedListItem ? 'ol' : 'ul';
  const listElem = document.createElement(listTagName);

  list.forEach(listItem => {
    const { children, contents } = listItem;
    const listItemElem = document.createElement('li');

    listItemElem.innerHTML = contents;
    listElem.appendChild(listItemElem);

    if (children.length) {
      listElem.appendChild(createListElement(children));
    }
  });

  return listElem;
}

function getListElement(pTags) {
  const listData = createListData(pTags);
  const rootChildren = listData.filter(({ parent }) => !parent);

  return createListElement(rootChildren);
}

export function replaceParagraphToList(container) {
  let removeElems = [];

  domUtils.findAll(container, 'p').forEach(pTag => {
    const { className, nextSibling } = pTag;

    if (MS_CLASS_NAME_LIST_RX.test(className)) {
      removeElems.push(pTag);

      if (!nextSibling || (nextSibling && MS_CLASS_NAME_P_RX.test(nextSibling.className))) {
        const listElem = getListElement(removeElems);
        const target = nextSibling || container;

        if (nextSibling) {
          domUtils.prepend(target, listElem);
        } else {
          domUtils.append(target, listElem);
        }

        removeElems.forEach(emoveElem => domUtils.remove(emoveElem));
        removeElems = [];
      }
    }
  });
}
