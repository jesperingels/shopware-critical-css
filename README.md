# Shopware-critical-css
Simple critical-css implementation for your Shopware theme. It's not the most clean implementation since we're adding CSS inside the views folder, but it works!

## Install
Place these files inside the root of your Shopware (child) theme  
Run `npm install`

## Preparations
- Extend / override the meta.html.twig file in your theme -> (`src/Resources/views/storefront/layout/meta.html.twig`)
  - Include the critical-css file which will be generated inside the views folder
  - And lazy load the all.js file like this:
```
{% block layout_head_stylesheet %}
    <style>
        {% sw_include '@YourTheme/storefront/critical_css/critical.css' %}
    </style>

    {% if isHMRMode %}
        {# CSS will be loaded from the JS automatically #}
    {% else %}
        {% set assets = theme_config('assets.css') %}
        {% for file in assets %}
            <link rel="stylesheet"
                  media="print"
                  href="{{ asset(file, 'theme') }}"
                  as="style"
                  onload="this.onload=null;this.media='all'">
            <noscript><link rel="stylesheet" href="{{ asset(file, 'theme') }}"></noscript>
        {% endfor %}
    {% endif %}
{% endblock %}
```

## Usage
- Change the `criticalcss-pagelist.json` file to your needs. You only need one domain and one url. 
- Inside the `gulpfile.js` change `const stage = 'live'`to the domain you want to use. 
- In the penthouse options change the output path to your own path. 
```javascript
css: '../../../public/theme/50efd88eeaf7015d87475f14162d8fb3/css/all.css'  // path to original css file on disk
```
- Finally just run `gulp critical-css` and the critical CSS is generated  
Note that the critical css might not be perfect in one run. Try and experiment with the width and height options inside gulpfile.js