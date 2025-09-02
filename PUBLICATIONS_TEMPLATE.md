# Publications Template

当你有论文需要添加时，请替换 `index.html` 中 Publications 部分的内容。

## 模板代码：

```html
<div class="publication-card">
  <img src="/images/paper-thumbnail.png" alt="Paper Thumbnail" class="publication-image">
  <div class="publication-content">
    <h3 class="publication-title">Paper Title Here</h3>
    <p class="publication-authors">Haoyu Gu, Co-author 1, Co-author 2</p>
    <p class="publication-venue">Conference/Journal Name 2024</p>
    <p class="publication-description">
      Brief description of your paper's contribution and findings. Keep it concise but informative.
    </p>
    <div class="publication-links">
      <a href="paper-link.pdf" class="publication-link">Paper</a>
      <a href="github-repo" class="publication-link secondary">Code</a>
      <a href="dataset-link" class="publication-link secondary">Dataset</a>
      <a href="poster-link.pdf" class="publication-link secondary">Poster</a>
    </div>
  </div>
</div>
```

## 说明：

1. **图片**：将论文相关图片（如 architecture diagram）放在 `/images/` 文件夹中
2. **标题**：论文的完整标题
3. **作者**：按贡献顺序列出作者，自己的名字可以加粗
4. **会议/期刊**：发表的会议或期刊名称及年份
5. **描述**：简洁地描述论文的主要贡献
6. **链接**：提供相关链接（论文PDF、代码、数据集、海报等）

## 中英文版本：

为每个元素添加 `data-lang` 属性来支持双语：

```html
<h3 class="publication-title" data-lang='{"en": "English Title", "zh": "中文标题"}'>English Title</h3>
```

## 图片要求：

- 推荐尺寸：200x120px
- 格式：PNG 或 JPG
- 文件名：描述性的，如 `paper-multimodal-ai.png`