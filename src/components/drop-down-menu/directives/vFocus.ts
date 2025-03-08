const vFocus = {
    mounted(el: HTMLDivElement) {
        const oInput = el.querySelector('.input') as HTMLInputElement
        const oIcon = el.querySelector('.icon') as HTMLElement
        const placeholder = el.querySelector('.placeholder') as HTMLElement
        const oMenu = el.querySelector('.menu') as HTMLElement

        if (!oInput || !oIcon || !placeholder || !oMenu) return;

        oInput.addEventListener('focus', handleFocus)
        oInput.addEventListener('blur', handleBlur)

        function handleFocus () {
            console.log(oIcon, 'icon')
            placeholder.style.display = 'none'
            // oIcon.className = 'iconfont icon-fangdajing icon'
            oMenu.style.display = 'block'
        }

        function handleBlur () {
            if(!oIcon || !placeholder || !oMenu) return;
            // oIcon.className = 'iconfont icon-xiajiantou icon'

            setTimeout(() => {
                oMenu.style.display = 'none'

                if(oInput.value.length === 0) {
                    placeholder.style.display = 'block'
                }
            }, 200)

        }

    },
}

export default vFocus