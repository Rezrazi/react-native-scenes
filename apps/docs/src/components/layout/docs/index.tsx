import Link from "fumadocs-core/link";
import type * as PageTree from "fumadocs-core/page-tree";
import { NavProvider } from "fumadocs-ui/contexts/layout";
import { TreeContextProvider } from "fumadocs-ui/contexts/tree";
import {
  type GetSidebarTabsOptions,
  getSidebarTabs,
} from "fumadocs-ui/utils/get-sidebar-tabs";
import { Languages, Sidebar as SidebarIcon } from "lucide-react";
import {
  type ComponentProps,
  type HTMLAttributes,
  type ReactNode,
  useMemo,
} from "react";
import { cn } from "../../../lib/cn";
import { LanguageToggle, LanguageToggleText } from "../../language-toggle";
import { type Option, RootToggle } from "../../root-toggle";
import { LargeSearchToggle, SearchToggle } from "../../search-toggle";
import {
  Sidebar,
  SidebarCollapseTrigger,
  type SidebarComponents,
  SidebarContent,
  SidebarContentMobile,
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarPageTree,
  type SidebarProps,
  SidebarTrigger,
  SidebarViewport,
} from "../../sidebar";
import { ThemeToggle } from "../../theme-toggle";
import { buttonVariants } from "../../ui/button";
import {
  type BaseLayoutProps,
  BaseLinkItem,
  getLinks,
  type LinkItemType,
} from "../shared/index";
import { CollapsibleControl, LayoutBody, LayoutTabs, Navbar } from "./client";

export interface DocsLayoutProps extends BaseLayoutProps {
  tree: PageTree.Root;

  sidebar?: SidebarOptions;

  tabMode?: "top" | "auto";

  /**
   * Props for the `div` container
   */
  containerProps?: HTMLAttributes<HTMLDivElement>;
}

interface SidebarOptions
  extends ComponentProps<"aside">,
    Pick<SidebarProps, "defaultOpenLevel" | "prefetch"> {
  enabled?: boolean;
  component?: ReactNode;
  components?: Partial<SidebarComponents>;

  /**
   * Root Toggle options
   */
  tabs?: Option[] | GetSidebarTabsOptions | false;

  banner?: ReactNode;
  footer?: ReactNode;

  /**
   * Support collapsing the sidebar on desktop mode
   *
   * @defaultValue true
   */
  collapsible?: boolean;
}

export function DocsLayout({
  nav: { transparentMode, ...nav } = {},
  sidebar: {
    tabs: sidebarTabs,
    enabled: sidebarEnabled = true,
    ...sidebarProps
  } = {},
  searchToggle = {},
  themeSwitch = {},
  tabMode = "auto",
  i18n = false,
  children,
  tree,
  ...props
}: DocsLayoutProps) {
  const tabs = useMemo(() => {
    if (Array.isArray(sidebarTabs)) {
      return sidebarTabs;
    }
    if (typeof sidebarTabs === "object") {
      return getSidebarTabs(tree, sidebarTabs);
    }
    if (sidebarTabs !== false) {
      return getSidebarTabs(tree);
    }
    return [];
  }, [tree, sidebarTabs]);
  const links = getLinks(props.links ?? [], props.githubUrl);
  const sidebarVariables = cn(
    "md:[--fd-sidebar-width:268px] lg:[--fd-sidebar-width:286px]"
  );

  function sidebar() {
    const {
      footer,
      banner,
      collapsible = true,
      component,
      components,
      defaultOpenLevel,
      prefetch,
      ...rest
    } = sidebarProps;
    if (component) {
      return component;
    }

    const iconLinks = links.filter((item) => item.type === "icon");

    const viewport = (
      <SidebarViewport>
        {links
          .filter((v) => v.type !== "icon")
          .map((item, i, list) => (
            <SidebarLinkItem
              className={cn(i === list.length - 1 && "mb-4")}
              item={item}
              key={i}
            />
          ))}
        <SidebarPageTree components={components} />
      </SidebarViewport>
    );

    const mobile = (
      <SidebarContentMobile {...rest}>
        <SidebarHeader>
          <div className="flex items-center gap-1.5 text-fd-muted-foreground">
            <div className="flex flex-1">
              {iconLinks.map((item, i) => (
                <BaseLinkItem
                  aria-label={item.label}
                  className={cn(
                    buttonVariants({
                      size: "icon-sm",
                      color: "ghost",
                      className: "p-2",
                    })
                  )}
                  item={item}
                  key={i}
                >
                  {item.icon}
                </BaseLinkItem>
              ))}
            </div>
            {i18n ? (
              <LanguageToggle>
                <Languages className="size-4.5" />
                <LanguageToggleText />
              </LanguageToggle>
            ) : null}
            {themeSwitch.enabled !== false &&
              (themeSwitch.component ?? (
                <ThemeToggle className="p-0" mode={themeSwitch.mode} />
              ))}
            <SidebarTrigger
              className={cn(
                buttonVariants({
                  color: "ghost",
                  size: "icon-sm",
                  className: "p-2",
                })
              )}
            >
              <SidebarIcon />
            </SidebarTrigger>
          </div>
          {tabs.length > 0 && <RootToggle options={tabs} />}
          {banner}
        </SidebarHeader>
        {viewport}
        <SidebarFooter className="empty:hidden">{footer}</SidebarFooter>
      </SidebarContentMobile>
    );

    const content = (
      <SidebarContent {...rest}>
        <SidebarHeader>
          <div className="flex">
            <Link
              className="me-auto inline-flex items-center gap-2.5 font-medium text-[0.9375rem]"
              href={nav.url ?? "/"}
            >
              {nav.title}
            </Link>
            {nav.children}
            {collapsible && (
              <SidebarCollapseTrigger
                className={cn(
                  buttonVariants({
                    color: "ghost",
                    size: "icon-sm",
                    className: "mb-auto text-fd-muted-foreground",
                  })
                )}
              >
                <SidebarIcon />
              </SidebarCollapseTrigger>
            )}
          </div>
          {searchToggle.enabled !== false &&
            (searchToggle.components?.lg ?? (
              <LargeSearchToggle hideIfDisabled />
            ))}
          {tabs.length > 0 && tabMode === "auto" && (
            <RootToggle options={tabs} />
          )}
          {banner}
        </SidebarHeader>
        {viewport}
        {(i18n ||
          iconLinks.length > 0 ||
          themeSwitch?.enabled !== false ||
          footer) && (
          <SidebarFooter>
            <div className="flex items-center text-fd-muted-foreground empty:hidden">
              {i18n && (
                <LanguageToggle>
                  <Languages className="size-4.5" />
                </LanguageToggle>
              )}
              {iconLinks.map((item, i) => (
                <BaseLinkItem
                  aria-label={item.label}
                  className={cn(
                    buttonVariants({ size: "icon-sm", color: "ghost" })
                  )}
                  item={item}
                  key={i}
                >
                  {item.icon}
                </BaseLinkItem>
              ))}
              {themeSwitch.enabled !== false &&
                (themeSwitch.component ?? (
                  <ThemeToggle
                    className="ms-auto p-0"
                    mode={themeSwitch.mode}
                  />
                ))}
            </div>
            {footer}
          </SidebarFooter>
        )}
      </SidebarContent>
    );

    return (
      <Sidebar
        Content={
          <>
            {collapsible && <CollapsibleControl />}
            {content}
          </>
        }
        defaultOpenLevel={defaultOpenLevel}
        Mobile={mobile}
        prefetch={prefetch}
      />
    );
  }

  return (
    <TreeContextProvider tree={tree}>
      <NavProvider transparentMode={transparentMode}>
        {nav.enabled !== false &&
          (nav.component ?? (
            <Navbar className="h-(--fd-nav-height) on-root:[--fd-nav-height:56px] md:hidden md:on-root:[--fd-nav-height:0px]">
              <Link
                className="inline-flex items-center gap-2.5 font-semibold"
                href={nav.url ?? "/"}
              >
                {nav.title}
              </Link>
              <div className="flex-1">{nav.children}</div>
              {searchToggle.enabled !== false &&
                (searchToggle.components?.sm ?? (
                  <SearchToggle className="p-2" hideIfDisabled />
                ))}
              {sidebarEnabled && (
                <SidebarTrigger
                  className={cn(
                    buttonVariants({
                      color: "ghost",
                      size: "icon-sm",
                      className: "p-2",
                    })
                  )}
                >
                  <SidebarIcon />
                </SidebarTrigger>
              )}
            </Navbar>
          ))}
        <LayoutBody
          {...props.containerProps}
          className={cn(
            "md:[&_#nd-page_article]:pt-12 xl:[&_#nd-page_article]:px-8",
            sidebarEnabled && sidebarVariables,
            props.containerProps?.className
          )}
        >
          {sidebarEnabled && sidebar()}
          {tabMode === "top" && tabs.length > 0 && (
            <LayoutTabs
              className="sticky top-[calc(var(--fd-nav-height)+var(--fd-tocnav-height))] z-10 border-b bg-fd-background px-6 pt-3 max-md:hidden xl:px-8"
              options={tabs}
            />
          )}
          {children}
        </LayoutBody>
      </NavProvider>
    </TreeContextProvider>
  );
}

function SidebarLinkItem({
  item,
  ...props
}: {
  item: Exclude<LinkItemType, { type: "icon" }>;
  className?: string;
}) {
  if (item.type === "menu") {
    return (
      <SidebarFolder {...props}>
        {item.url ? (
          <SidebarFolderLink external={item.external} href={item.url}>
            {item.icon}
            {item.text}
          </SidebarFolderLink>
        ) : (
          <SidebarFolderTrigger>
            {item.icon}
            {item.text}
          </SidebarFolderTrigger>
        )}
        <SidebarFolderContent>
          {item.items.map((child, i) => (
            <SidebarLinkItem item={child} key={i} />
          ))}
        </SidebarFolderContent>
      </SidebarFolder>
    );
  }

  if (item.type === "custom") {
    return <div {...props}>{item.children}</div>;
  }

  return (
    <SidebarItem
      external={item.external}
      href={item.url}
      icon={item.icon}
      {...props}
    >
      {item.text}
    </SidebarItem>
  );
}

export { CollapsibleControl, Navbar, SidebarTrigger, type LinkItemType };
