const state = {
  current:     '0',      
  previous:    '',       
  operator:    null,     
  justEvaled:  false,    
  resetNext:   false,    
};

const resultEl    = document.getElementById('result');
const expressionEl = document.getElementById('expression');

function updateDisplay(value) {
  resultEl.textContent = value;
  resultEl.classList.remove('sm', 'xs', 'error');

  if (value.length > 12) resultEl.classList.add('xs');
  else if (value.length > 8) resultEl.classList.add('sm');
}

function updateExpression(text) {
  expressionEl.textContent = text || '\u00a0'; // non-breaking space to preserve height
}

function formatNumber(num) {
  if (!isFinite(num)) return 'Error';
  // Use toPrecision to avoid floating point drift, then strip trailing zeros
  const str = parseFloat(num.toPrecision(10)).toString();
  return str;
}

function inputNumber(digit) {
  if (state.resetNext || state.justEvaled) {
    state.current   = digit === '.' ? '0.' : digit;
    state.resetNext = false;
    state.justEvaled = false;
  } else {
    if (digit === '.' && state.current.includes('.')) return;
    if (state.current === '0' && digit !== '.') {
      state.current = digit;
    } else {
      if (state.current.length >= 12) return; // max digits
      state.current += digit;
    }
  }
  updateDisplay(state.current);
  if (state.operator) {
    updateExpression(`${state.previous} ${state.operator} ${state.current}`);
  }
}

function inputOperator(op) {
  if (state.operator && !state.resetNext) {
    evaluate(false);
  }

  state.previous   = state.current;
  state.operator   = op;
  state.resetNext  = true;
  state.justEvaled = false;

  updateExpression(`${state.previous} ${op}`);
  highlightOperator(op);
}

function evaluate(final = true) {
  if (!state.operator || state.resetNext) return;

  const a = parseFloat(state.previous);
  const b = parseFloat(state.current);
  let result;

  switch (state.operator) {
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case '×': result = a * b; break;
    case '÷':
      if (b === 0) {
        showError('÷ 0');
        return;
      }
      result = a / b;
      break;
    default: return;
  }

  const formatted = formatNumber(result);

  if (final) {
    updateExpression(`${state.previous} ${state.operator} ${state.current} =`);
  }

  updateDisplay(formatted);
  clearOperatorHighlight();

  state.current    = formatted;
  state.previous   = '';
  state.operator   = null;
  state.resetNext  = false;
  state.justEvaled = final;
}

function clearAll() {
  state.current    = '0';
  state.previous   = '';
  state.operator   = null;
  state.resetNext  = false;
  state.justEvaled = false;

  updateDisplay('0');
  updateExpression('');
  clearOperatorHighlight();
}

function toggleSign() {
  if (state.current === '0') return;
  state.current = state.current.startsWith('-')
    ? state.current.slice(1)
    : '-' + state.current;
  updateDisplay(state.current);
}

function percent() {
  const val = parseFloat(state.current) / 100;
  state.current = formatNumber(val);
  updateDisplay(state.current);
}

function showError(msg) {
  resultEl.textContent = msg;
  resultEl.classList.add('error');
  updateExpression('');
  // Auto-clear after 1.5s
  setTimeout(clearAll, 1500);
}

function highlightOperator(op) {
  clearOperatorHighlight();
  document.querySelectorAll('.btn-op').forEach(btn => {
    if (btn.dataset.value === op) btn.classList.add('op-active');
  });
}

function clearOperatorHighlight() {
  document.querySelectorAll('.btn-op').forEach(btn => {
    btn.classList.remove('op-active');
  });
}

document.querySelector('.keypad').addEventListener('click', e => {
  const btn = e.target.closest('.btn');
  if (!btn) return;

  const action = btn.dataset.action;
  const value  = btn.dataset.value;

  switch (action) {
    case 'number':   inputNumber(value);  break;
    case 'decimal':  inputNumber('.');    break;
    case 'operator': inputOperator(value); break;
    case 'equals':   evaluate(true);      break;
    case 'clear':    clearAll();          break;
    case 'sign':     toggleSign();        break;
    case 'percent':  percent();           break;
  }
});


document.addEventListener('keydown', e => {
  // Digits 0–9
  if (/^[0-9]$/.test(e.key)) {
    inputNumber(e.key);
    animateKey(e.key);
    return;
  }

  switch (e.key) {
    case '.':
    case ',':
      inputNumber('.');
      animateKey('.');
      break;
    case '+':
      inputOperator('+');
      animateKey('+');
      break;
    case '-':
      inputOperator('-');
      animateKey('-');
      break;
    case '*':
      inputOperator('×');
      animateKey('×');
      break;
    case '/':
      e.preventDefault(); // stop browser quick-find
      inputOperator('÷');
      animateKey('÷');
      break;
    case 'Enter':
    case '=':
      evaluate(true);
      animateKey('=');
      break;
    case 'Backspace':
      handleBackspace();
      break;
    case 'Escape':
      clearAll();
      animateKey('AC');
      break;
    case '%':
      percent();
      animateKey('%');
      break;
  }
});

function handleBackspace() {
  if (state.justEvaled || state.current.length <= 1) {
    state.current = '0';
  } else {
    state.current = state.current.slice(0, -1) || '0';
  }
  updateDisplay(state.current);
}

function animateKey(label) {
  const btns = document.querySelectorAll('.btn');
  btns.forEach(btn => {
    const matches =
      btn.textContent.trim() === label ||
      btn.dataset.value === label;
    if (matches) {
      btn.classList.add('kb-press');
      setTimeout(() => btn.classList.remove('kb-press'), 120);
    }
  });
}
