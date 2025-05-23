import { css } from '@emotion/react';
import styled from '@emotion/styled';
import facetarrow from 'assets/icon-facetarrow.svg';
import downloadIcon from 'assets/icon-download.svg';
import chevron from 'assets/icon-chevron-down.svg';
import doubleChevron from 'assets/icon-chevron-double-down.svg';

import base from 'theme';
import { HEADER_HEIGHT } from 'theme/headerStyles';
import { brandPrimaryHighlightHover, whiteButtonHover } from 'theme/hoverStyles';
import { Col } from 'theme/system';

const {
  fonts: { openSans },
  keyedPalette: {
    athensGray,
    athensLightGray,
    black,
    bombay,
    brandPrimary,
    dustyGray,
    graySuit,
    havelockBlue,
    ironApprox,
    lightBlack,
    lightPorcelain,
    linen,
    mischka,
    pelorousapprox,
    sandyBeach,
    seaBuckthorn,
    tiaMaria,
    trout,
    whisper,
    white,
  },
} = base;

export const inputWrapperStyle = css`
  border-radius: 10px;
  border: solid 1px ${bombay};
  padding: 5px 25px 5px 10px;

  &:active,
  &:focus,
  &:hover {
    border-color: ${havelockBlue};
  }

  &:focus-within {
    box-shadow: 0 0 0 3px rgba(21, 156, 228, 0.4) !important;
  }
`;

export const inputIconStyle = css`
  display: flex;
  padding-bottom: 1px;
  color: ${bombay};
`;

export const inputStyle = css`
  font-family: ${openSans};
  font-size: 12px;
  font-weight: normal;
  color: ${trout};
  padding: 0;

  &:focus {
    box-shadow: none;
  }
`;

export const inputButtonStyle = css`
  display: flex;
  background: none;
  text-transform: uppercase;
  font-family: ${openSans};
  font-size: 12px;
  font-weight: bold;
  align-items: center;
  ${whiteButtonHover};
  color: ${black};
  fill: ${black} !important;
  cursor: pointer;

  &:hover {
    color: ${black};
    fill: ${black} !important;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.8;

    &:hover {
      color: ${black};
      fill: ${black} !important;
      background-color: ${white};
    }
  }
`;

export const inputDropdownButtonStyle = css`
  height: 28px;
  border-radius: 10px;
  border: 1px solid ${bombay};
  align-items: center;
  padding: 0 10px;
`;

export default css`
  .ReactTable,
  .TableWrapper {
    background: transparent;
  }

  .ReactTable .rt-table,
  .TableWrapper {
    border: 1px solid ${mischka};
  }

  .ReactTable.-striped.audit-table .rt-table .rt-tbody {
    min-height: 338px;
    max-height: 338px;
    overflow-y: scroll;
  }

  .ReactTable.-striped.confirm-maf-table {
    margin-bottom: 24px;
  }

  .ReactTable .rt-table input[type='checkbox'],
  .TableWrapper table input[type='checkbox'] {
    cursor: pointer;
  }

  .ReactTable .rt-td {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }

  .ReactTable .rt-td,
  .TableWrapper .cell {
    padding: 4px 8px 4px 4px;
    border-right: 1px solid ${mischka};
  }

  /* Additional padding for scroll bars */
  .ReactTable .rt-td:last-child,
  .TableWrapper .cell:last-child {
    padding-right: 18px;
    border-right: none;
  }

  .ReactTable .rt-resizable-header,
  .TableWrapper .TableHeaderGroup .table_header {
    padding: 4px 8px;
  }

  .ReactTable .rt-resizable-header-content,
  .TableWrapper .TableHeaderGroup .table_header {
    color: ${black};
    text-transform: capitalize;
    text-align: left;
    font-family: ${openSans};
    font-size: 12px;
    font-weight: bold;
    overflow-wrap: break-word;
    overflow: visible;
    white-space: normal;
  }

  .ReactTable .rt-thead .rt-resizable-header:last-child,
  .TableWrapper .TableHeaderGroup .table_header:last-child {
    overflow: unset;
    border-right: none;

    .rt-resizer {
      width: 18px;
      right: 0;
    }
  }

  .ReactTable .rt-td > a,
  .clickable {
    ${brandPrimaryHighlightHover};
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
  }

  .TableWrapper thead {
    border: none;
  }

  .ReactTable .rt-thead,
  .TableWrapper .TableHeaderGroup {
    background-color: #ffffff;
  }

  .ReactTable .rt-table,
  .TableWrapper table {
    overflow-x: scroll;
    overflow-y: visible;

    .rt-thead.-header {
      box-shadow: none;
    }
  }

  .ReactTable .rt-thead .rt-tr .rt-th,
  .TableWrapper .TableHeaderGroup .table_header {
    padding-top: 4px;
    padding-bottom: 4px;
    border-right: 1px solid ${mischka};
    border-bottom: 1px solid ${mischka};
    align-items: baseline;
    vertical-align: top;

    &:hover {
      background-color: ${lightPorcelain};
    }
  }

  .ReactTable .rt-thead .rt-th.-sort-asc,
  .ReactTable .rt-thead .rt-td.-sort-asc,
  .TableWrapper .TableHeaderGroup .table_header.asc {
    box-shadow: inset 0 3px 0 0 ${seaBuckthorn};
  }

  .ReactTable .rt-thead .rt-th.-sort-desc,
  .ReactTable .rt-thead .rt-td.-sort-desc,
  .TableWrapper .TableHeaderGroup .table_header.desc {
    box-shadow: inset 0 -3px 0 0 ${seaBuckthorn};
  }

  .TableWrapper .Row {
    border-bottom: 1px solid ${mischka};
  }

  .ReactTable.-striped .rt-tr.-odd,
  .TableWrapper .Row:nth-of-type(odd) {
    background-color: ${white};
  }

  .ReactTable.-striped .rt-tr.-even,
  .TableWrapper .Row:nth-of-type(even) {
    background-color: ${athensGray};
  }

  .TableBody tr.Row:first-of-type {
    padding-top: 0px;
  }

  .ReactTable.-highlight .rt-tbody .rt-tr:not(.-padRow):hover {
    background-color: ${whisper};
  }

  .ReactTable .rt-tr-group {
    flex: none;
  }

  .pagination-bottom,
  .ReactTable .pagination-bottom {
    height: auto;
    background: transparent;
    padding: 4px 0 0;
  }

  .ReactTable .-pagination,
  .-pagination {
    font-family: ${openSans};
    box-shadow: none;
    border: none;
    height: auto;
    padding: 0;
  }

  .ReactTable .-pagination .select-wrap.-pageSizeOptions {
    font-size: 12px;
    color: ${trout};
    margin: 0;
  }

  // TODO: refactor shared Select/Dropdown styles into a component
  .ReactTable .-pagination .select-wrap.-pageSizeOptions select {
    border-radius: 4px;
    border-color: ${bombay};
    font-family: ${openSans};
    appearance: none;
    width: 60px;
    box-sizing: border-box;
    background-color: ${white};
    background-image: url(${chevron}),
      linear-gradient(
        90deg,
        transparent 0%,
        transparent calc(100% - 25px),
        ${bombay} calc(100% - 25px),
        ${bombay} calc(100% - 24px),
        transparent calc(100% - 24px),
        transparent 100%
      );
    background-repeat: no-repeat;
    background-size: 10px, contain;
    background-position: bottom 8px right 8px, 0 0;
    cursor: pointer;
    transition: background-color 0.25s ease;

    &:hover {
      background-color: ${lightPorcelain};
      background-image: url(${chevron}),
        linear-gradient(
          90deg,
          transparent 0%,
          transparent calc(100% - 25px),
          ${bombay} calc(100% - 25px),
          ${bombay} calc(100% - 24px),
          transparent calc(100% - 24px),
          transparent 100%
        );
    }
  }

  .ReactTable .-pagination_button {
    font-size: 11px;
    ${whiteButtonHover};
  }

  .ReactTable .-pagination .-pageJump,
  .ReactTable .-pagination .-pageJump .-pagination_button {
    border-color: ${graySuit};
  }

  .ReactTable .-pagination .-pageJump {
    border-radius: 10px;
    color: ${black};
  }

  .ReactTable .-pagination_button.-current {
    color: ${black};
    background: ${linen};
  }

  .ReactTable .-pagination .-pageJump .-pagination_button.-toStart,
  .ReactTable .-pagination .-pageJump .-pagination_button.-previous,
  .ReactTable .-pagination .-pageJump .-pagination_button.-next,
  .ReactTable .-pagination .-pageJump .-pagination_button.-toEnd {
    color: transparent;
    cursor: pointer;
    position: relative;
  }

  .ReactTable .-pagination .-pageJump .-pagination_button.-toStart.-disabled,
  .ReactTable .-pagination .-pageJump .-pagination_button.-previous.-disabled,
  .ReactTable .-pagination .-pageJump .-pagination_button.-next.-disabled,
  .ReactTable .-pagination .-pageJump .-pagination_button.-toEnd.-disabled {
    cursor: not-allowed;
    opacity: 80%;
    background-color: ${white};

    &:hover {
      background-color: ${white};
    }
  }

  .ReactTable .-pagination .-pageJump .-pagination_button.-previous::after {
    content: '';
    background: url(${chevron}) no-repeat;
    background-size: 8px;
    background-position: center;
    display: block;
    width: 100%;
    height: 100%;
    transform: rotate(90deg);
    position: absolute;
  }

  .ReactTable .-pagination .-pageJump .-pagination_button.-next::after {
    content: '';
    background: url(${chevron}) no-repeat;
    background-size: 8px;
    background-position: center;
    display: block;
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
    position: absolute;
  }

  .ReactTable .-pagination .-pageJump .-pagination_button.-toStart::after {
    content: '';
    background: url(${doubleChevron}) no-repeat;
    background-size: 8px;
    background-position: center;
    display: block;
    width: 100%;
    height: 100%;
    transform: rotate(90deg);
    position: absolute;
  }

  .ReactTable .-pagination .-pageJump .-pagination_button.-toEnd::after {
    content: '';
    background: url(${doubleChevron}) no-repeat;
    background-size: 8px;
    background-position: center;
    display: block;
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
    position: absolute;
  }

  .input-range__track.input-range__track--active {
    background-color: #fc7678 !important;
  }

  .showMore-wrapper.more,
  .showMore-wrapper.less {
    display: flex;
    justify-content: normal;
    align-items: center;
    padding: 2px 10px 6px;
    margin: 0;
    font-size: 11px;
  }

  .showMore-wrapper.more::before {
    content: '+';
    display: flex;
    justify-content: center;
    align-items: center;
    width: 12px;
    height: 12px;
    border-radius: 100%;
    color: ${white};
    background-color: #ed494c;
    font-size: 11px;
    font-weight: normal;
    margin-right: 4px;
    margin-top: 0;
  }

  .showMore-wrapper.less::before {
    content: '-';
    display: flex;
    justify-content: center;
    align-items: center;
    width: 12px;
    height: 12px;
    border-radius: 100%;
    color: ${white};
    background-color: #ed494c;
    font-size: 11px;
    font-weight: normal;
    margin-right: 4px;
    margin-top: 0;
    padding-bottom: 1px;
    margin-bottom: -1px;
  }

  .sqon-view {
    border: none;
    padding: 4px 19px 10px;
    flex: 1;

    .sqon-group > * {
      margin-top: 8px;
    }
  }

  .sqon-value {
    background-color: ${tiaMaria};
    color: ${white};
    font-family: ${openSans};
    padding: 0 8px 2px;
    margin-right: 4px;
    cursor: pointer;
  }

  .sqon-clear {
    background-color: ${white};
    color: ${black};
    font-size: 12px;
    font-weight: bold;
    border-radius: 10px;
    border: 1px solid ${bombay};
    height: 26px;
  }

  .sqon-field,
  .sqon-op {
    color: ${black};
    font-weight: normal;
    font-size: 12px;
  }

  .sqon-field.sqon-field--chart-title {
    font-size: 13px;
    font-weight: bold;
    text-transform: capitalize;
  }

  .sqon-field.pie-center {
    position: absolute;
    top: 50%;
    transform: translateY(-10px);
    font-size: 20px;
    font-weight: bold;
    text-align: center;

    div {
      font-size: 10px;
      font-weight: normal;
      text-align: center;
      text-transform: capitalize;
    }
  }

  .sqon-value-group {
    color: ${tiaMaria};
    margin-top: 4px;
  }

  .search-header-actions {
    position: relative;
    display: flex;
    flex-direction: row;
    height: 28px;
    padding: 0 8px;
    border-left: 1px solid #d4d6dd;
  }

  .search-results-wrapper {
    padding: 16px 18px 0;
  }

  .search-split-pane,
  .search-results-wrapper,
  .aggregations-wrapper {
    /* important to override react-split-pane inline style */
    height: calc(100vh - ${HEADER_HEIGHT}) !important;
    overflow-y: auto;
    position: relative !important;
  }

  .search-split-pane .Pane1 {
    box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.1), 0 1px 5px 0 rgba(0, 0, 0, 0.08);
  }

  .aggregations-wrapper .arrow {
    display: block;
    width: 8px;
    height: 8px;
    margin-right: 5px;
    color: ${brandPrimary};
  }

  .aggregations-wrapper .arrow::after {
    content: '';
    display: block;
    background: url(${facetarrow}) no-repeat;
    width: 8px;
    height: 8px;
  }

  .aggregations .aggregation-card .header,
  .aggregations .aggregation-group .header {
    position: relative;
  }

  .aggregation-card .header .title-wrapper,
  .aggregation-group .header .title-wrapper {
    padding: 10px;
    background-image: linear-gradient(to bottom, ${athensGray} 9%, ${athensLightGray} 91%);
    border-bottom: none;
  }

  .aggregation-card .header .title-wrapper > div,
  .aggregation-group .header .title-wrapper > div {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .aggregation-card .header .title-wrapper .action-icon svg,
  .aggregation-group .header .title-wrapper .action-icon svg {
    fill: ${bombay};
    width: 14px;
    heigth: 14px;
    transition: background 0.25s ease;

    &:hover {
      fill: ${dustyGray};
    }
  }

  .aggregation-card .filter,
  .aggregation-group .filter {
    padding: 10px 11px;
  }

  .no-sqon-message {
    text-transform: none;
    color: #000;
    font-size: 14px;
    font-weight: normal;
  }

  .aggregations {
    width: 100%;
  }

  .aggregation-card .title-wrapper,
  .aggregation-group .title-wrapper {
    background-color: #f4f5f7;
    padding: 8px;
  }

  .aggregation-card .title-wrapper .title,
  .aggregation-group .title-wrapper .title {
    font-family: ${openSans};
    font-size: 13px;
    font-weight: bold;
    line-height: 1.38;
    text-transform: capitalize;
    color: ${black};
    width: 100%;
  }

  .aggregation-card,
  .aggregation-group {
    border-left: none;
    border-top: none;
    border-color: ${mischka};
    padding: 0px !important;
    margin: 0px !important;
  }

  .aggregation-card .header,
  .aggregation-group .header {
    padding: 0px;
    margin: 0;
  }

  .aggregation-card .bucket,
  .aggregation-group .bucket {
    padding: 0;
  }

  .aggregation-card .bucket .bucket-item,
  .aggregation-group .bucket .bucket-item {
    padding: 2px 6px;
    display: flex;
    align-items: baseline;

    &:hover {
      background-color: ${lightPorcelain};
    }
  }

  .aggregation-card .bucket-item .bucket-link,
  .aggregation-group .bucket-item .bucket-link {
    display: flex;
    align-items: flex-start;
  }

  .aggregation-card .bucket-item .bucket-link input[type='checkbox'],
  .aggregation-group .bucket-item .bucket-link input[type='checkbox'] {
    margin-right: 6px;
  }

  .aggregation-card .bucket-item .bucket-link .textHighlight,
  ..aggregation-group .bucket-item .bucket-link .textHighlight {
    font-size: 12px;
    margin-top: 1px;
  }

  .aggregation-card .bucket-item .bucket-count,
  .aggregation-card .toggle-button .toggle-button-option .bucket-count,
  .aggregation-group .bucket-item .bucket-count,
  .aggregation-group .toggle-button .toggle-button-option .bucket-count {
    border-radius: 6px;
    background-color: ${sandyBeach};
    color: ${black};
    min-width: 20px;
    height: 18px;
    font-family: ${openSans};
    font-size: 10px;
    line-height: 1.4;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px;
  }

  .aggregation-card .bucket .toggle-button,
  .aggregation-group .bucket .toggle-button {
    margin: 4px 10px;
    border-radius: 10px;
    border: 1px solid ${graySuit};
    overflow: hidden;
  }

  .aggregation-card .bucket .toggle-button .toggle-button-option,
  .aggregation-group .bucket .toggle-button .toggle-button-option {
    font-size: 12px;
    border-color: ${graySuit};
    border-width: 0;
    border-right-width: 1px;
    border-radius: unset;

    &:not(.active):hover {
      background-color: ${lightPorcelain};
    }
  }

  .aggregation-card .bucket .toggle-button .toggle-button-option .textHighlight,
  .aggregation-group .bucket .toggle-button .toggle-button-option .textHighlight {
    margin-right: 2px;
  }

  .aggregation-card .bucket .toggle-button .toggle-button-option:first-of-type,
  .aggregation-group .bucket .toggle-button .toggle-button-option:first-of-type {
    border-top-left-radius: unset;
    border-bottom-left-radius: unset;
  }

  .aggregation-card .bucket .toggle-button .toggle-button-option:last-child,
  .aggregation-group .bucket .toggle-button .toggle-button-option:last-child {
    border-top-right-radius: unset;
    border-bottom-right-radius: unset;
    border-right-width: 0 !important;
  }

  .aggregation-card .bucket .toggle-button .toggle-button-option.active,
  .aggregation-group .bucket .toggle-button .toggle-button-option.active {
    background-color: ${linen};
  }

  .aggregations .aggregation-card .title-wrapper,
  .aggregations .aggregation-group .title-wrapper {
    .title-control {
      width: 100%;

      .title {
        width: 100%;
      }
    }
  }

  .custom-search-wrapper .title-wrapper {
    flex: 1;
    justify-content: start;
    align-items: center;

    .arrow:not(.collapsed) {
      transform: rotate(90deg);
    }
  }

  .title-wrapper:not(.collapsed) .title-control > img {
    transform: rotate(90deg);
  }

  .quick-search {
    flex: 1;
  }

  .model-name-search-label {
    font-weight: bold;
    color: #545454;
    margin-right: 16px;
    font-size: 14px;
  }

  .search-sidebar-content-wrapper {
    padding: 4px 8px;
  }

  .search-sidebar-content .quick-search .inputWrapper,
  .toolbar .inputWrapper {
    ${inputWrapperStyle};
  }

  .search-sidebar-content .quick-search .inputWrapper .inputIcon,
  .search-results-wrapper .tableToolbar .group .inputWrapper .inputIcon,
  .toolbar .inputWrapper .inputIcon,
  .filter .inputWrapper .inputIcon {
    ${inputIconStyle};
  }

  .search-results-wrapper .tableToolbar .group .inputWrapper .inputIcon svg {
    width: 16px;
    height: 16px;
  }

  .search-sidebar-content .quick-search .inputWrapper input,
  .search-results-wrapper .tableToolbar .group .inputWrapper input,
  .toolbar .inputWrapper input {
    ${inputStyle}
  }

  .quick-search-result-entity-1 {
    background-color: ${brandPrimary};
    color: white;
  }

  .showMore-wrapper {
    color: ${brandPrimary};
  }

  .Resizer {
    background: #000;
    opacity: 0.2;
    z-index: 1;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -moz-background-clip: padding;
    -webkit-background-clip: padding;
    background-clip: padding-box;
  }

  .Resizer:hover {
    -webkit-transition: all 2s ease;
    transition: all 2s ease;
  }

  .Resizer.horizontal {
    height: 11px;
    margin: -5px 0;
    border-top: 5px solid rgba(255, 255, 255, 0);
    border-bottom: 5px solid rgba(255, 255, 255, 0);
    cursor: row-resize;
    width: 100%;
  }

  .Resizer.horizontal:hover {
    border-top: 5px solid rgba(0, 0, 0, 0.5);
    border-bottom: 5px solid rgba(0, 0, 0, 0.5);
  }

  .Resizer.vertical {
    width: 11px;
    margin: 0 -5px;
    border-left: 5px solid rgba(255, 255, 255, 0);
    border-right: 5px solid rgba(255, 255, 255, 0);
    cursor: col-resize;
  }

  .Resizer.vertical:hover {
    border-left: 5px solid rgba(0, 0, 0, 0.5);
    border-right: 5px solid rgba(0, 0, 0, 0.5);
  }
  .Resizer.disabled {
    cursor: not-allowed;
  }
  .Resizer.disabled:hover {
    border-color: transparent;
  }

  .search-results-wrapper .tableToolbar {
    padding: 10px 0 8px;
    font-size: 12px;
    align-items: center;
  }

  .search-results-wrapper .tableToolbar .group,
  .tableToolbar .buttonWrapper {
    margin-left: 8px;
  }

  .tableToolbar button,
  .toolbar button {
    &:not(.multiSelectDropDownControlsButton) {
      ${inputButtonStyle};
    }
  }

  .tableToolbar .dropDownHeader,
  .tableToolbar .buttonWrapper {
    border: none;
    padding: 0;
  }

  .tableToolbar .group .DropdownContainer button.DropDownButton,
  .tableToolbar .dropDownHeader button,
  .tableToolbar .buttonWrapper button,
  .toolbar button {
    &:not(.multiSelectDropDownControlsButton) {
      ${inputDropdownButtonStyle};
    }
  }

  .tableToolbar .dropDownButtonContent {
    font-family: ${openSans};
    margin-right: 5px;
  }

  .tableToolbar .dropDownButton svg {
    stroke: ${trout};
    stroke-width: 3px;
    width: 12px;
    height: 12px;
  }

  .tableToolbar .buttonWrapper button::before {
    content: '';
    display: block;
    background: url(${downloadIcon}) no-repeat;
    background-size: contain;
    width: 12px;
    height: 12px;
    margin-right: 5px;
  }

  .tableToolbar .dropDownContentElement.custom {
    padding: 0px;
  }

  .DropdownContainer,
  .SelectionControls,
  .ListItem {
    background: white;
  }

  .DropdownContainer fieldset.ListWrapper {
    right: 7px;
    top: 28px;
  }

  .dropDownHeader .dropDownContent,
  .List {
    max-height: 360px;
    overflow-y: auto;
    font-size: 13px;
    box-shadow: 1px 1.7px 4px 0 ${lightBlack};
    padding: 0;
  }

  .dropDownContent .dropDownContentElement.clickable,
  .List .ListItem {
    padding: 5px 10px;
    color: black;

    &:first-of-type {
      padding-top: 10px;
    }

    &:last-child {
      padding-bottom: 10px;
    }
  }

  .dropDownContent .dropDownContentElement.clickable:hover,
  .List .ListItem:hover {
    background-color: #f3f6f7;
  }
  .dropDownContent .dropDownContentElement.custom .selectedModelsLabel {
    border-bottom: 1px solid #d9d9df;
    font-family: 'Open Sans', sans-serif;
    font-size: 11px;
    height: 25px;
    color: #1c8292;
    width: 100%;
    padding: 4px 8px;
  }
`;

export const List = styled('div')`
  display: flex;
  flex-direction: column;
  width: 100%;

  > div {
    margin-bottom: 4px;
  }
`;

export const Toggle = styled('div')`
  color: ${brandPrimary};
  font-size: 11px;
  text-align: right;
  font-style: italic;
  margin: 6px 0 0 0;
`;

export const Footer = styled('footer')`
  min-height: 64px;
  background-color: ${white};
  border-top: 1px solid ${ironApprox};
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 16px;

  @media screen and (max-width: 1479px) {
    min-height: 90px;
    flex-direction: column-reverse;
    justify-content: space-around;
  }
`;

export const FooterNav = styled('ul')`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

export const FooterNavItem = styled('li')`
  height: 16px;
  padding: 0 8px;
  border-right: 1px solid ${black};

  &:first-of-type {
    padding-left: 4px;
  }

  &:last-child {
    padding-right: 0;
    border-right: none;
  }
`;

export const FooterImg = styled('img')`
  padding-left: 32px;

  &:first-of-type {
    padding-left: 0;
  }
`;

export const CopyrightText = styled('p')`
  margin: 0;
  padding: 0;
  color: ${black};
  font-family: ${openSans};
  font-size: 12px;
  height: 16px;
`;

export const FooterLink = styled('a')`
  ${brandPrimaryHighlightHover};
  font-size: 12px;
  display: block;
`;

export const ToggleButton = styled('button')`
  border-radius: 11px;
  border: none;
  width: 50px;
  height: 23px;
  position: relative;
  cursor: pointer;
  background-color: ${({ checked }) => (checked ? pelorousapprox : bombay)} !important;
  transition: background-color 0.25s ease !important;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)} !important;

  &::after {
    content: '';
    display: block;
    width: 21px;
    height: 21px;
    background-color: ${white} !important;
    border-radius: 100%;
    position: absolute;
    top: 1px;
    left: 1px;
    ${({ checked }) => checked && 'left: 28px;'};
    transition: left 0.25s ease !important;
  }
`;

export const MainCol = styled(Col)``.withComponent('main');
