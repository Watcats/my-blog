/**
 * Environment module.
 * @file Environment 线上和开发环境配置
 * @module environment
 * @author myblog 
 */

const environment = process.env.NODE_ENV;
const isDevMode = Object.is(environment, 'development');
const isProdMode = Object.is(environment, 'production');

module.exports = {
	isDevMode,
	isProdMode,
	environment,
};
