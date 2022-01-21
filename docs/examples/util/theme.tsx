import React from 'react';
import { TinyColor } from '@ctrl/tinycolor';
import { Theme, CSSObject } from '../../../src';

export type GetStyle = (prefixCls: string, token: DerivativeToken) => CSSObject;

export interface DesignToken {
  primaryColor: string;
  textColor: string;

  borderRadius: number;
  borderColor: string;
  borderWidth: number;
}

export interface DerivativeToken extends DesignToken {
  primaryColorDisabled: string;
}

const defaultDesignToken: DesignToken = {
  primaryColor: '#1890ff',
  textColor: '#FFFFFF',
  borderRadius: 2,
  borderColor: 'black',
  borderWidth: 1,
};

// 模拟推导过程
function derivative(designToken: DesignToken): DerivativeToken {
  return {
    ...designToken,
    primaryColorDisabled: new TinyColor(designToken.primaryColor)
      .setAlpha(0.5)
      .toString(),
  };
}

const ThemeContext = React.createContext(
  new Theme<DesignToken, DerivativeToken>(derivative),
);

const DesignTokenContext =
  React.createContext<Partial<DesignToken>>(defaultDesignToken);

export function useToken() {
  const rootDesignToken = React.useContext(DesignTokenContext);
  const mergedDesignToken = React.useMemo(
    () => ({
      ...defaultDesignToken,
      ...rootDesignToken,
    }),
    [rootDesignToken],
  );
  const theme = React.useContext(ThemeContext);

  return React.useMemo(
    () => theme.getDerivativeToken(mergedDesignToken),
    [theme, mergedDesignToken],
  );
}
