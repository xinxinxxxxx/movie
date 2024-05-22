/* 
————页面主题切换————
*/



// 元素切换函数
// 作用：动态地添加或删除元素的类，以改变页面颜色主题。
// 元素切换函数，它通过 classList.toggle 方法在元素的 class 列表中添加或移除 "active" 类。
const elemToggleFunc = function (elem) { elem.classList.toggle("active"); }

// 头部导航栏收缩展开
// 作用：用于在页面滚动时修改导航栏的外观。
const header = document.querySelector("[data-header]");
window.addEventListener("scroll", function () {
  // 监听页面滚动事件，判断滚动距离是否大于等于 10px
  if (window.scrollY >= 10) {
    // 若大于10px 则为具有 [data-header] 属性的元素添加 "active" 类，
    header.classList.add("active");
  } else {
    // 若小于10px 则为具有 [data-header] 属性的元素移除 "active" 类，
    header.classList.remove("active");
  }
});

// 页面受挤压时候导航栏按钮效果
// 作用：用于响应式设计，切换导航栏
const navToggleBtn = document.querySelector("[data-nav-toggle-btn]");
const navbar = document.querySelector("[data-navbar]");
// 添加点击事件监听器
navToggleBtn.addEventListener("click", function () {
  // 切换元素的类
  elemToggleFunc(navToggleBtn);
  elemToggleFunc(navbar);
  elemToggleFunc(document.body);
});

// 用于切换页面的主题（日间/夜间模式）。
// 同时切换页面 body 上的 "dark_theme" 和 "light_theme" 类。
// 页面主题信息也会存储在本地存储中，以在刷新页面时保持用户选择。
const themeToggleBtn = document.querySelector("[data-theme-btn]");
themeToggleBtn.addEventListener("click", function () {
  elemToggleFunc(themeToggleBtn);
  // 检查按钮是否具有 "active" 类
  if (themeToggleBtn.classList.contains("active")) {
    // 应用 "light_theme" 类并移除 "dark_theme" 类
    document.body.classList.remove("dark_theme");
    document.body.classList.add("light_theme");
    // 存储选择的主题
    localStorage.setItem("theme", "light_theme");
    // 如果不具有 "active" 类
  } else {
    // 移除 "light_theme" 类并应用 "dark_theme" 类
    document.body.classList.add("dark_theme");
    document.body.classList.remove("light_theme");
    localStorage.setItem("theme", "dark_theme");
  }
});

// 从浏览器的localStorage中获取名为"theme"的值：
// localStorage是一个Web存储机制，可以保存键值对，这些键值对在浏览器关闭后仍然存在。
// 当页面刷新时候也保持主题
if (localStorage.getItem("theme") === "light_theme") {
  // 这些代码是针对切换主题按钮进行的操作，
  // 向该元素添加"active"类
  themeToggleBtn.classList.add("active");
  // 改变文档的body元素显示样式 移除黑夜主题样式
  document.body.classList.remove("dark_theme");
  //改变文档的body元素显示样式 添加白天主题样式
  document.body.classList.add("light_theme");
} else {
  // 从该元素中移除"active"类。
  themeToggleBtn.classList.remove("active");
  // 改变文档的body元素显示样式 移除白天主题样式
  document.body.classList.remove("light_theme");
  //改变文档的body元素显示样式 添加黑夜主题样式
  document.body.classList.add("dark_theme");
}

// 在元素上添加监听事件
// 作用：为一组元素添加相同类型的事件监听器。
const addEventOnElements = function (elements, eventType, callback) {
  // 通过循环遍历每个元素，为它们添加指定类型的事件监听器。
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}



/* 
————滚动器————
*/



// 对于每个具有 [data-slider] 属性的元素，都会调用 initSlider 函数。
const sliders = document.querySelectorAll("[data-slider]");
// initSlider 函数负责初始化滑动器，获取滑动器相关元素和设置初始状态。
const initSlider = function (currentSlider) {
  // 查询第一个带有 data-slider-container 属性的子元素，并将其存储在 sliderContainer 常量中。
  const sliderContainer = currentSlider.querySelector("[data-slider-container]");
  // 查询第一个带有 data-slider-prev 属性的子元素，并将其存储在 sliderPrevBtn 常量中。
  const sliderPrevBtn = currentSlider.querySelector("[data-slider-prev]");
  // 查询第一个带有 data-slider-next 属性的子元素，并将其存储在 sliderNextBtn 常量中。
  const sliderNextBtn = currentSlider.querySelector("[data-slider-next]");
  // 这行代码获取currentSlider元素的计算样式中"--slider-items"属性的值，并将其转换为数字。表示当前滑块容器中可见的项目数量。
  let totalSliderVisibleItems = Number(getComputedStyle(currentSlider).getPropertyValue("--slider-items"));
  // 这行代码计算滑块容器中的总项目数量（sliderContainer.childElementCount）减去可见的项目数量（totalSliderVisibleItems）。这样得到的是隐藏的项目数量。
  let totalSlidableItems = sliderContainer.childElementCount - totalSliderVisibleItems;
  // 这行代码初始化一个变量currentSlidePos为0，表示当前滑块的位置或索引。
  let currentSlidePos = 0;
  const moveSliderItem = function () {
    // 使滑块（sliderContainer）向左移动其子元素中第 currentSlidePos 个元素的左边距的距离。其中 currentSlidePos 的值会随着时间或其他事件而改变，从而改变滑块的位置。
    sliderContainer.style.transform = `translateX(-${sliderContainer.children[currentSlidePos].offsetLeft}px)`;
  }


  /* 
  ——切换下一个——
  */


  // 作用：slideNext 函数处理下一个滑动的逻辑，通过调整 currentSlidePos 来切换当前展示的项，并通过 moveSliderItem 函数更新展示。
  // 定义了一个名为 slideNext 的函数。
  const slideNext = function () {
    // 定义了一个布尔变量 slideEnd。如果 currentSlidePos（当前显示的索引）大于或等于 totalSlidableItems（总可滑动项目数），则 slideEnd 为 true，否则为 false。
    const slideEnd = currentSlidePos >= totalSlidableItems;
    // 检查 slideEnd 是否为 true。
    if (slideEnd) {
      // 如果 slideEnd 为 true，将 currentSlidePos 重置为0，意味着轮播回到了第一张图片。
      currentSlidePos = 0;
      // 如果 slideEnd 不为 true，进入此分支。
    } else {
      // 将 currentSlidePos 增加1，意味着下一张图片将被显示。
      currentSlidePos++;
    }
    // 调用前面定义的 moveSliderItem 函数，使滑块移动到新的位置。
    moveSliderItem();
  }
  // 加一个点击事件监听器。当用户点击这个按钮时，会触发 slideNext 函数。
  sliderNextBtn.addEventListener("click", slideNext);


  /* 
  ——上一个——
   */


  // 作用：slidePrev 函数处理上一个滑动的逻辑，同样通过调整 currentSlidePos 来切换当前展示的项，并通过 moveSliderItem 函数更新展示。
  // 定义了一个名为 slidePrev 的函数。
  const slidePrev = function () {
    // 检查 currentSlidePos 是否小于或等于0。
    if (currentSlidePos <= 0) {
      // 如果 currentSlidePos 小于或等于0，将其设置为 totalSlidableItems（总可滑动项目数）
      currentSlidePos = totalSlidableItems;
      // 如果 currentSlidePos 大于0
    } else {
      // 将 currentSlidePos 减少1，意味着上一张图片将被显示
      currentSlidePos--;
    }
    // 调用前面定义的 moveSliderItem 函数，使滑块移动到新的位置。
    moveSliderItem();
  }
  // 这行代码为名为 sliderPrevBtn 的DOM元素（可能是滑块的“上一张”按钮）添加一个点击事件监听器。当用户点击这个按钮时，会触发 slidePrev 函数。
  sliderPrevBtn.addEventListener("click", slidePrev);
  // 定义了一个常量 dontHaveExtraItem，并根据 totalSlidableItems（总可滑动项目数）是否小于或等于0来设置其值。如果 totalSlidableItems 小于或等于0，那么 dontHaveExtraItem 将为 true，否则为 false。
  const dontHaveExtraItem = totalSlidableItems <= 0;
  // 最后，如果没有额外的可滑动项，将隐藏 "上一个" 和 "下一个" 按钮。
  // 检查 dontHaveExtraItem 是否为 true。
  if (dontHaveExtraItem) {
    // 即没有额外的可滑动项目，这行代码将隐藏可能是滑块的“下一张”按钮。
    sliderNextBtn.style.display = 'none';
    // 隐藏可能是滑块的“上一张”按钮
    sliderPrevBtn.style.display = 'none';
  }
}
//允许用户通过点击按钮切换滑动项。
for (let i = 0, len = sliders.length; i < len; i++) { initSlider(sliders[i]); }