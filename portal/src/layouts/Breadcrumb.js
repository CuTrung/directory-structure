import React, { createElement, useState, useEffect } from 'react';
import { Breadcrumb } from 'antd';
import { getBreadcrumb, urlToList } from 'utils';
import styled from 'styled-components';

const Header = styled.h1`
  font-size: 22px;
  font-weight: 700;
  max-width: 30%;
  width: 100%;
  display: inline-flex;
  align-items: center;
  margin-left: 0px;
  margin-bottom: 0;
`;

const IconHeader = styled.span`
  font-size: 20px;
  display: inline-block;
  height: 20px;
  width: 20px;
  margin-right: 15px;
  color: var(--mainColor);
  line-height: 2;
  &:hover {
    text-decoration: none;
  }
`;

function AppBreadcrumb(props) {
  const { location, routes, linkElement = 'a' } = props;
  const [breadcrumb, setBreadcrumb] = useState(null);

  useEffect(() => {
    if (location) {
      let breadcrumb = conversionFromLocation(location, routes);
      setBreadcrumb(breadcrumb);
    }
  }, [location, routes]);

  const conversionFromLocation = (routerLocation, routes) => {
    const pathSnippets = urlToList(routerLocation.pathname);
    const extraBreadcrumbItems = pathSnippets.map((url, index) => {
      const currentBreadcrumb = getBreadcrumb(routes, url);
      const isLinkable = index !== pathSnippets.length - 1 && currentBreadcrumb.component;

      if (index === 0 && pathSnippets.length > 1) {
        return (
          <Breadcrumb.Item key={url}>
            {createElement(
              isLinkable ? linkElement : 'span',
              { [linkElement === 'a' ? 'href' : 'to']: url },
              <IconHeader>
                <i className='fi fi-rr-angle-circle-left' />
              </IconHeader>,
            )}
          </Breadcrumb.Item>
        );
      } else {
        return currentBreadcrumb.name && currentBreadcrumb.component ? (
          <Breadcrumb.Item key={url}>
            {createElement(
              isLinkable ? linkElement : 'span',
              { [linkElement === 'a' ? 'href' : 'to']: url },
              <span style={{ fontSize: 22 }}>{currentBreadcrumb.name}</span>,
            )}
          </Breadcrumb.Item>
        ) : null;
      }
    });

    return (
      <Breadcrumb className={'breadcrumb'} separator=''>
        {extraBreadcrumbItems}
      </Breadcrumb>
    );
  };

  return <Header>{breadcrumb}</Header>;
}

export default AppBreadcrumb;
