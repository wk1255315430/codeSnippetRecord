 <!-- 采用 me 项目的 750 宽度 设计稿 px / 100 rem 布局方式 -->
    <script>
        (function (window, document) {
            var clientW = document.documentElement.clientWidth || document.body.clientWidth;
            var fontSize = (clientW * 100) / 750;
            document.getElementsByTagName('html')[0].style['font-size'] = fontSize + 'px';
        })(window, document)
    </script>