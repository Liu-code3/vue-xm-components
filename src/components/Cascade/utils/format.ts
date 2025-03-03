import { ExtendedHTMLElement } from "../type/index";

/**
 *
 * @param {HTMLElement} select 要填充的下拉列表
 * @param {Array} list 被填充的数据, 数组
 */
export function fillSelect (select: ExtendedHTMLElement, list: any[]) {
    // 如果下拉列表有值 得先清除
    const ul = select.querySelector('.options') as Element;
    ul.innerHTML.length && (ul.innerHTML = '');


    if(!list.length) {
        select.classList.add('disabled')
        setTitleText(select, '请选择')
        return
    }

    select.classList.remove('disabled')

    const tip = select.dataset.tip
    setTitleText(select, `请选择${tip}`)

    select.datas = list // 将目前填充的数据; 添加到dom对象的属性datas中

    const Fragment = document.createDocumentFragment()
    for (const item of list) {
        const li = document.createElement('li');
        li.textContent = item.label;
        Fragment.appendChild(li);
    }
    ul.appendChild(Fragment)

    // 以下也可以实现li填充
    // ul.innerHTML = list.map(obj => `<li>${obj.label}</li>`).join('')
}

/**
 *
 * @param {HTMLElement} select 下拉框DOM元素
 * @param {string} textContent title下的span文字
 */
export function setTitleText (select: Element, textContent: string) {
    const span = select.querySelector('.title span') as Element
    span.textContent = textContent
}
