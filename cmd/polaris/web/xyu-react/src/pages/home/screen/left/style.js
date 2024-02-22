import styled from 'styled-components';

export const LeftPage = styled.div`
  width: 26.75rem;
  height: auto;
  padding: 0 0.1rem;
  margin-left: 5.35rem;
`;

export const LeftTopBox = styled.div`
  position: relative;
  height: 19.75rem;
  width: 100%;
  .left-top-borderBox12 {
    width: inherit;
    height: inherit;
    padding: 0.1875rem;
    .transparent-card {
      background-color: transparent;
    }
    .left-top {
      width: 100%;
      height: 100%;
      border-radius: 10px;
      background-color: transparent;
      .title-dis {
        margin-top: 0.1875rem;
        display: flex;
        justify-content: space-around;
        align-items: center;
        font-size: 2.6rem;
        color: #c0c9d2;
        &-keyword {
          padding-left: 0.125rem;
          color: #47dae8;
        }
      }
    }
  }
`;
export const LeftBottomBox = styled.div`
  position: relative;
  margin-top: 3.25rem;
  height: 20.75rem;
  width: 100%;
  .left-bottom-borderBox13 {
    width: inherit;
    height: inherit;
    padding: 0.25rem 0.1875rem;
    .left-bottom {
      width: 100%;
      height: 100%;
      border-radius: 10px;
      background-color: rgba(19, 25, 47, 0.6);
    }
  }
`;
