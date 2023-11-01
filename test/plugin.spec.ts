import * as minify from 'minify-html-literals';
import * as path from 'path';
import { TransformPluginContext } from 'rollup';
import minifyHTML, { Options } from '../src/index';

import {describe, beforeEach, expect, jest, test} from '@jest/globals';

describe('minify-html-literals', () => {
  const fileName = path.resolve('test.js');
  let context: { warn: jest.Mock; error: jest.Mock };
  beforeEach(() => {
    context = {
      warn: jest.fn(),
      error: jest.fn()
    };
  });

  test('should return a plugin with a transform function', () => {
    const plugin = minifyHTML();
    expect(plugin).not.toBeNull();
    expect(typeof plugin).toBe('object');
    expect(typeof plugin.name).toBe('string');
    expect(typeof plugin.transform).toBe('function');
  });

  test('should call minifyHTMLLiterals()', () => {
    const options: Options = {};
    const plugin = minifyHTML(options);
    expect(typeof options.minifyHTMLLiterals).toBe('function');
    const minifySpy = jest.spyOn(options, 'minifyHTMLLiterals');
    plugin.transform.apply((context as unknown) as TransformPluginContext, [
      'return',
      fileName
    ]);
    expect(minifySpy).toHaveBeenCalled();
  });

  test('should pass id and options to minifyHTMLLiterals()', () => {
    const options: Options = {
      options: {
        minifyOptions: {
          minifyCSS: false
        }
      }
    };

    const plugin = minifyHTML(options);
    const minifySpy = jest.spyOn(options, 'minifyHTMLLiterals');
    plugin.transform.apply((context as unknown) as TransformPluginContext, [
      'return', fileName
    ]);
    expect(minifySpy).toHaveBeenCalledWith(
      expect.any(String), 
      expect.objectContaining({
        fileName: fileName,
        minifyOptions: expect.objectContaining({
          minifyCSS: false
        })
      })
    );
  });

  test('should allow custom minifyHTMLLiterals', () => {
    const customMinify = jest.fn((source: string, options?: minify.DefaultOptions) => {
      return minify.minifyHTMLLiterals(source, options);
    });

    const plugin = minifyHTML({
      minifyHTMLLiterals: customMinify
    });

    plugin.transform.apply((context as unknown) as TransformPluginContext, [
      'return',
      fileName
    ]);
    expect(customMinify).toHaveBeenCalled();
  });

  test('should warn errors', () => {
    const plugin = minifyHTML({
      minifyHTMLLiterals: () => {
        throw new Error('failed');
      }
    });

    plugin.transform.apply((context as unknown) as TransformPluginContext, [
      'return',
      fileName
    ]);
    expect(context.warn).toHaveBeenCalledWith('failed');
    expect(context.error).not.toHaveBeenCalled();
  });

  test('should fail is failOnError is true', () => {
    const plugin = minifyHTML({
      minifyHTMLLiterals: () => {
        throw new Error('failed');
      },
      failOnError: true
    });

    plugin.transform.apply((context as unknown) as TransformPluginContext, [
      'return',
      fileName
    ]);
    expect(context.error).toHaveBeenCalledWith('failed');
    expect(context.warn).not.toHaveBeenCalled();
  });

  test('should filter ids', () => {
    let options: Options = {};
    minifyHTML(options);
    expect(typeof options.filter).toBe('function');
    expect(options.filter!(fileName)).toBe(true);
    options = {
      include: '*.ts'
    };

    minifyHTML(options);
    expect(typeof options.filter).toBe('function');
    expect(options.filter!(fileName)).toBe(false);
    expect(options.filter!(path.resolve('test.ts'))).toBe(true);
  });

  test('should allow custom filter', () => {
    const options = {
      filter: jest.fn(() => false)
    };

    const plugin = minifyHTML(options);
    plugin.transform.apply((context as unknown) as TransformPluginContext, [
      'return',
      fileName
    ]);
    expect(options.filter).toHaveBeenCalledWith(fileName);
  });

});
