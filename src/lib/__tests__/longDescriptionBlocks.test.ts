import { describe, expect, it } from 'vitest';
import { parseLongDescription } from '../longDescriptionBlocks';

describe('parseLongDescription', () => {
  it('parses plain single-paragraph text into one paragraph block', () => {
    const input = 'Simple browser utility with zero uploads or server calls.';
    expect(parseLongDescription(input)).toEqual([
      { type: 'paragraph', text: input },
    ]);
  });

  it('parses single-line ### heading blocks', () => {
    expect(parseLongDescription('### How Roman Numerals Work')).toEqual([
      { type: 'heading', text: 'How Roman Numerals Work' },
    ]);
  });

  it('parses consecutive - lines into a list block with 3 items', () => {
    const input = '- Alpha item\n- Beta item\n- Gamma item';
    expect(parseLongDescription(input)).toEqual([
      { type: 'list', items: ['Alpha item', 'Beta item', 'Gamma item'] },
    ]);
  });

  it('parses mixed intro, headings, paragraphs, and lists in order', () => {
    const input = [
      'Intro paragraph explaining the tool.',
      '### Core Rules',
      'First detail paragraph.\nWith wrapped line.',
      '- Rule one\n- Rule two',
      '### Final Notes',
      'Closing summary paragraph.',
    ].join('\n\n');

    expect(parseLongDescription(input)).toEqual([
      { type: 'paragraph', text: 'Intro paragraph explaining the tool.' },
      { type: 'heading', text: 'Core Rules' },
      { type: 'paragraph', text: 'First detail paragraph. With wrapped line.' },
      { type: 'list', items: ['Rule one', 'Rule two'] },
      { type: 'heading', text: 'Final Notes' },
      { type: 'paragraph', text: 'Closing summary paragraph.' },
    ]);
  });

  it('returns empty array for empty or whitespace-only inputs', () => {
    expect(parseLongDescription('')).toEqual([]);
    expect(parseLongDescription('   \n\n  \t \n ')).toEqual([]);
  });

  it('treats blocks mixing a - line with normal lines as a paragraph, not a list', () => {
    const input = '- Starts with dash\nNormal continuation line without dash';
    expect(parseLongDescription(input)).toEqual([
      { type: 'paragraph', text: '- Starts with dash Normal continuation line without dash' },
    ]);
  });

  it('trims whitespace around headings and list items', () => {
    const input = '###   Spaced Heading Title   \n\n-   First trimmed item   \n-  Second trimmed item\t';
    expect(parseLongDescription(input)).toEqual([
      { type: 'heading', text: 'Spaced Heading Title' },
      { type: 'list', items: ['First trimmed item', 'Second trimmed item'] },
    ]);
  });
});
