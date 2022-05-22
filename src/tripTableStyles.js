import styled from 'styled-components';

export const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr:nth-child(even) {
      background-color: #f2f2f2;
    }

    th,
    td {
      margin: 0;
      padding: 0.1rem 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      font-size: smaller;
      
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`