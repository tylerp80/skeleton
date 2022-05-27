import { SvgComponentType, SvgSpinner } from "../svgs";
import { classNames } from "@skeleton/lib";
import Link, { LinkProps } from "next/link";
import React, { forwardRef } from "react";

export type ButtonBaseProps = {
  variant?:
    | "primary"
    | "secondary"
    | "secondary-outline"
    | "success"
    | "icon"
    | "link";
  size?: "base" | "sm" | "lg" | "xs";

  /**
   * If `true`, the button will show a spinner.
   */
  isLoading?: boolean;
  /**
   * If `true`, the button will be styled in its active state.
   */
  isActive?: boolean;
  /**
   * If `true`, the button will be disabled.
   */
  isDisabled?: boolean;
  /**
   * The label to show in the button when `isLoading` is true
   * If no text is passed, it only shows the spinner
   */
  loadingText?: string;
  /**
   * If added, the button will show an icon before the button's label.
   * @type React.ReactElement
   */
  leftIcon?: React.ReactElement;
  /**
   * If added, the button will show an icon after the button's label.
   * @type React.ReactElement
   */
  rightIcon?: React.ReactElement;
  /**
   * The space between the button icon and label.
   */
  iconSpacing?: string;
  /**
   * Replace the spinner component when `isLoading` is set to `true`
   * @type React.ReactElement
   */
  spinner?: React.ReactElement;
  /**
   * It determines the placement of the spinner when isLoading is true
   * @default "start"
   */
  spinnerPlacement?: "start" | "end";

  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  shallow?: boolean;
};

export type ButtonProps = ButtonBaseProps &
  (
    | (Omit<JSX.IntrinsicElements["a"], "href"> & { href: LinkProps["href"] })
    | (JSX.IntrinsicElements["button"] & { href?: never })
  );

// eslint-disable-next-line react/display-name
export const Button = forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  ButtonProps
>((props: ButtonProps, forwardedRef) => {
  const {
    variant = "primary",
    size = "base",

    shallow,
    // attributes propagated from `HTMLAnchorProps` or `HTMLButtonProps`
    ...passThroughProps
  } = props;

  // Buttons are **always** disabled if we're in a `loading` state

  const disabled = false;
  const loading = false;
  //   const disabled = props.disabled || loading;

  // If pass an `href`-attr is passed it's `<a>`, otherwise it's a `<button />`
  const isLink = typeof props.href !== "undefined";
  const elementType = isLink ? "a" : "button";

  const element = React.createElement(
    elementType,
    {
      ...passThroughProps,
      disabled,
      ref: forwardedRef,
      className: classNames(
        // base styles
        "inline-flex items-center justify-center select-none outline-none",

        // size styles
        size === "xs" && "p-1.5 leading-4 text-sm font-semibold rounded-sm",
        size === "sm" && "px-3 py-2 leading-4 text-sm font-semibold rounded-sm",
        size === "base" && "px-5 py-2 text-sm font-semibold rounded-sm",
        size === "lg" && "px-6 py-2 text-base font-semibold rounded-sm",

        // variant styles
        variant === "primary" &&
          (disabled || loading
            ? "bg-brand text-white opacity-50"
            : "bg-brand text-white hover:bg-opacity-95"),
        variant === "secondary" &&
          (disabled || loading
            ? "bg-secondaryButton text-secondaryButtonText opacity-50"
            : "bg-secondaryButton text-secondaryButtonText hover:bg-opacity-95"),
        variant === "secondary-outline" &&
          (disabled || loading
            ? "bg-body text-secondaryButtonText border border-gray-200 opacity-50"
            : "bg-body text-secondaryButtonText border border-gray-200 hover:bg-secondaryButtonHover hover:bg-opacity-20"),
        variant === "success" &&
          (disabled || loading
            ? "bg-success text-buttonText opacity-50"
            : "bg-success text-buttonText hover:bg-opacity-95"),
        variant === "icon" &&
          "bg-transparent text-gray-400 px-0 py-0 hover:text-brand",
        variant === "link" && "bg-transparent text-gray-400 hover:text-brand",

        // loading & disabled styles
        loading && "cursor-wait",
        disabled && "cursor-not-allowed",

        props.className
      ),

      // if we click a disabled button, we prevent going through the click handler
      onClick: disabled
        ? (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
            e.preventDefault();
          }
        : props.onClick,
    },
    <>
      <div className={classNames(loading ? "absolute" : "hidden")}>
        <SvgSpinner className="h-4 w-4 animate-spin" />
      </div>
      <span
        className={classNames(
          loading && "opacity-0",
          "inline-flex items-center"
        )}
      >
        {/* {StartIcon && (
          <StartIcon
            className={classNames(
              "inline",
              "h-5 w-5",
              props.children && "mr-2.5",
              classNameStartIcon
            )}
          />
        )} */}
        {props.children}
        {/* {EndIcon && (
          <EndIcon
            className={classNames(
              "inline",
              "h-5 w-5",
              props.children && "ml-2.5",
              classNameEndIcon
            )}
          />
        )} */}
      </span>
    </>
  );

  return props.href ? (
    <Link passHref href={props.href} shallow={shallow && shallow}>
      {element}
    </Link>
  ) : (
    element
  );
});

export default Button;
