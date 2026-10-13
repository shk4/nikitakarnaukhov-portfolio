import { Children, cloneElement, isValidElement, type ReactNode } from "react";
import { typograph } from "./typography";

/** Formats editorial text only, leaving attributes and precisely positioned artwork alone. */
export function typography(node: ReactNode): ReactNode {
  if (typeof node === "string") return typograph(node);
  if (Array.isArray(node)) return Children.map(node, typography);
  if (!isValidElement<{ children?: ReactNode }>(node)) return node;
  if (["svg", "code", "pre", "script", "style"].includes(String(node.type))) return node;
  if (node.props.children === undefined) return node;
  return cloneElement(node, {}, typography(node.props.children));
}
