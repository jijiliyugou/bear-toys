module.exports = {
  root: true,
  env: {
    node: true,
    jquery: true
  },
  globals: {
    BMAP_ANCHOR_TOP_LEFT: true,
    BMAP_NAVIGATION_CONTROL_LARGE: true,
    BMAP_ANCHOR_BOTTOM_RIGHT: true,
    BMAP_ANCHOR_BOTTOM_LEFT: true,
    BMAP_EARTH_MAP: true,
    BMAP_ANIMATION_BOUNCE: true,
    BMAP_STATUS_SUCCESS: true
  },
  // extends: ["plugin:vue/essential", "eslint:recommended"],
  extends: ['plugin:vue/essential', '@vue/eslint-config-standard'],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': 'off'
  }
}
