import Prism from 'prismjs';

import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';

const prismStyle = document.createElement('link');
prismStyle.rel = 'stylesheet';
prismStyle.type = 'text/css';
prismStyle.href = 'https://unpkg.com/prismjs@1.15.0/themes/prism.css';
document.body.appendChild(prismStyle);

export default Prism;
