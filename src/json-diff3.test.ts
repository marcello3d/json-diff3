import { JSONObject } from './json';
import { diff3 } from './json-diff3';

describe('patch3', () => {
  it('same object', () => {
    const state1 = {
      hello: 1,
      world: 2,
    };
    expect(diff3(state1, state1, state1)).toEqual(state1);
  });
  it('cloned objects', () => {
    const state1 = {
      hello: 1,
      world: 2,
    };
    const state2 = { ...state1 };
    const state3 = { ...state1 };
    expect(diff3(state1, state2, state3)).toEqual(state1);
  });
  it('only change left side', () => {
    const state1 = {
      hello: 1,
      world: 2,
    };
    const state2 = {
      hello: 2,
      world: 2,
    };
    const state3 = { ...state1 };
    expect(diff3(state1, state2, state3)).toEqual(state2);
  });

  it('only change right side', () => {
    const state1 = {
      hello: 1,
      world: 2,
    };
    const state2 = { ...state1 };
    const state3 = {
      hello: 2,
      world: 2,
    };
    expect(diff3(state1, state2, state3)).toEqual(state3);
  });

  it('change from both sides', () => {
    const state1 = {
      hello: 1,
      world: 2,
    };
    const state2 = {
      hello: 2,
      world: 2,
    };
    const state3 = {
      hello: 1,
      world: 3,
    };
    expect(diff3(state1, state2, state3)).toEqual({
      hello: 2,
      world: 3,
    });
  });

  it('add from both sides', () => {
    const state1 = {
      hello: 1,
      world: 2,
    };
    const state2 = {
      hello: 1,
      world: 2,
      a: 2,
    };
    const state3 = {
      hello: 1,
      world: 2,
      b: 3,
    };
    expect(diff3(state1, state2, state3)).toEqual({
      hello: 1,
      world: 2,
      a: 2,
      b: 3,
    });
  });
  it('add on left, change on right', () => {
    const state1 = {
      hello: 1,
      world: 2,
    };
    const state2 = {
      hello: 1,
      world: 2,
      a: 2,
    };
    const state3 = {
      hello: 1,
      world: 3,
    };
    expect(diff3(state1, state2, state3)).toEqual({
      hello: 1,
      world: 3,
      a: 2,
    });
  });
  it('change on left, add on right', () => {
    const state1 = {
      hello: 1,
      world: 2,
    };
    const state2 = {
      hello: 1,
      world: 3,
    };
    const state3 = {
      hello: 1,
      world: 2,
      b: 3,
    };
    expect(diff3(state1, state2, state3)).toEqual({
      hello: 1,
      world: 3,
      b: 3,
    });
  });
  it('add on left, delete on right', () => {
    const state1 = {
      hello: 1,
      world: 2,
    };
    const state2 = {
      hello: 1,
      world: 2,
      a: 2,
    };
    const state3 = {
      hello: 1,
    };
    expect(diff3(state1, state2, state3)).toEqual({
      hello: 1,
      a: 2,
    });
  });
  it('remove on left, add on right', () => {
    const state1 = {
      hello: 1,
      world: 2,
    };
    const state2 = {
      hello: 1,
    };
    const state3 = {
      hello: 1,
      world: 2,
      b: 3,
    };
    expect(diff3(state1, state2, state3)).toEqual({
      hello: 1,
      b: 3,
    });
  });
  it('remove on left, change on right', () => {
    const state1 = {
      hello: 1,
      world: 2,
    };
    const state2 = {
      hello: 1,
    };
    const state3 = {
      hello: 1,
      world: 3,
    };
    expect(() => diff3(state1, state2, state3)).toThrow('Conflict at /world');
  });

  it('throws on conflict', () => {
    const state1 = {
      hello: 1,
      world: 2,
    };
    const state2 = {
      hello: 2,
      world: 2,
    };
    const state3 = {
      hello: 3,
      world: 3,
    };
    expect(() => diff3(state1, state2, state3)).toThrow('Conflict at /hello');
  });

  it('handles array add', () => {
    const state1 = [1, 2, 3];
    const state2 = [1, 2, 3];
    const state3 = [1, 2, 4, 3];
    expect(diff3(state1, state2, state3)).toEqual([1, 2, 4, 3]);
  });
  it('handles array add 2', () => {
    const state1 = [1, 2, 3];
    const state2 = [1, 2, 3];
    const state3 = [1, 2, 3, 4];
    expect(diff3(state1, state2, state3)).toEqual([1, 2, 3, 4]);
  });
  it('handles array add and move', () => {
    const state1 = [1, 2, 3];
    const state2 = [2, 1, 3];
    const state3 = [1, 2, 3, 4];
    expect(diff3(state1, state2, state3)).toEqual([2, 1, 3, 4]);
  });
  it('handles array simple moves', () => {
    const state1 = [1, 2, 3, 4, 5, 6];
    const state2 = [1, 2, 3, 4, 6, 5];
    const state3 = [2, 1, 3, 4, 5, 6];
    expect(diff3(state1, state2, state3)).toEqual([2, 1, 3, 4, 6, 5]);
  });
  it('handles array complex move', () => {
    const state1 = [1, 2, 3, 4, 5, 6];
    const state2 = [1, 5, 2, 3, 4, 6];
    const state3 = [2, 3, 4, 1, 5, 6];
    expect(diff3(state1, state2, state3)).toEqual([5, 2, 3, 4, 1, 6]);
  });
  it('handles array simple moves and delete', () => {
    const state1 = [1, 2, 3, 4, 5, 6];
    const state2 = [1, 3, 4, 5, 6];
    const state3 = [1, 2, 3, 4, 6, 5];
    expect(diff3(state1, state2, state3)).toEqual([1, 3, 4, 6, 5]);
  });
  it('handles array simple moves and add', () => {
    const state1 = [1, 2, 3, 4, 5, 6];
    const state2 = [1, 7, 2, 3, 4, 5, 6];
    const state3 = [1, 2, 3, 4, 6, 5];
    expect(diff3(state1, state2, state3)).toEqual([1, 7, 2, 3, 4, 6, 5]);
  });
  it('handles array complex move and delete', () => {
    const state1 = [1, 2, 3, 4, 5, 6];
    const state2 = [1, 5, 2, 4, 6];
    const state3 = [2, 3, 4, 1, 5, 6];
    expect(diff3(state1, state2, state3)).toEqual([5, 2, 4, 1, 6]);
  });
  it('handles array removal', () => {
    const state1 = [1, 2, 3];
    const state2 = [1, 2, 3];
    const state3 = [1, 3];
    expect(diff3(state1, state2, state3)).toEqual([1, 3]);
  });

  it('handles array double remove', () => {
    const state1 = [1, 2, 3];
    const state2 = [2, 3];
    const state3 = [1, 2];
    expect(diff3(state1, state2, state3)).toEqual([2]);
  });

  it('handles array double remove at end', () => {
    const state1 = [1, 2, 3];
    const state2 = [1, 2];
    const state3 = [1, 3];
    expect(diff3(state1, state2, state3)).toEqual([1]);
  });

  it('handles array add and remove', () => {
    const state1 = [1, 2, 3];
    const state2 = [2, 3];
    const state3 = [1, 2, 4, 3];
    expect(diff3(state1, state2, state3)).toEqual([2, 4, 3]);
  });
  it('handles keyed object array', () => {
    const state1 = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const state2 = [{ id: 2 }, { id: 3 }];
    const state3 = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
    expect(
      diff3(state1, state2, state3, {
        getArrayItemKey: (item: JSONObject) => String(item!.id),
      }),
    ).toEqual([{ id: 2 }, { id: 3 }, { id: 4 }]);
  });
  it('handles keyed object array conflict', () => {
    const state1 = [{ id: 'foo' }, { id: 'bar' }];
    const state2 = [{ id: 'foo' }, { id: 'bar', value: 1 }];
    const state3 = [{ id: 'foo' }, { id: 'bar', value: 2 }];
    expect(() =>
      diff3(state1, state2, state3, {
        getArrayItemKey: (item: JSONObject) => String(item!.id),
      }),
    ).toThrowError('Conflict at /bar/value');
  });
  it('handles keyed object array with values', () => {
    const state1 = [
      { id: 1, value: 1 },
      { id: 2, value: 2 },
      { id: 3, value: 3 },
    ];
    const state2 = [{ id: 2, value: 10 }, { id: 3, value: 3 }];
    const state3 = [
      { id: 1, value: 1 },
      { id: 2, value: 2 },
      { id: 3, value: 3 },
      { id: 4, value: 4 },
    ];
    expect(
      diff3(state1, state2, state3, {
        getArrayItemKey: (item: JSONObject) => String(item!.id),
      }),
    ).toEqual([{ id: 2, value: 10 }, { id: 3, value: 3 }, { id: 4, value: 4 }]);
  });
  it('fails on duplicate array keys 1', () => {
    const state1 = [1, 2, 4, 5, 6, 2];
    const state2 = [1, 5, 2, 4, 6];
    const state3 = [2, 3, 4, 1, 5, 6];
    expect(() => diff3(state1, state2, state3)).toThrowError(
      `Duplicate array key '2' at /`,
    );
  });
  it('fails on duplicate array keys 2', () => {
    const state1 = [1, 2, 4, 5, 6];
    const state2 = [1, 5, 2, 4, 6, 2];
    const state3 = [2, 3, 4, 1, 5, 6];
    expect(() => diff3(state1, state2, state3)).toThrowError(
      `Duplicate array key '2' at /`,
    );
  });
  it('fails on duplicate array keys 3', () => {
    const state1 = [1, 2, 4, 5, 6];
    const state2 = [1, 5, 2, 4, 6];
    const state3 = [2, 3, 4, 1, 5, 6, 2];
    expect(() => diff3(state1, state2, state3)).toThrowError(
      `Duplicate array key '2' at /`,
    );
  });
});
