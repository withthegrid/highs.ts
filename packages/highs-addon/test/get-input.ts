import {Input} from './inputs';

export function getInput(): Input {
  return {
    objective: [
      {
        type: 'dBus',
        prefix: '0',
        factor: 2400,
      },
      {
        type: 'dSecondary',
        prefix: '0.0.controllableAsset.3',
        factor: 1,
      },
      {
        type: 'dBus',
        prefix: '0.0',
        factor: 2400,
      },
    ],
    variables: [
      {
        type: 'pExchange',
        prefix: '0',
        lowerBound: -0.7378333333333333,
        upperBound: 0.7916666666666666,
      },
      {
        type: 'pSlack',
        prefix: '0',
      },
      {
        type: 'dBus',
        prefix: '0',
        lowerBound: 0,
      },
      {
        type: 'pExchange',
        prefix: '0.0',
        lowerBound: -0.625,
        upperBound: 1.0125,
      },
      {
        type: 'pSlack',
        prefix: '0.0',
      },
      {
        type: 'dBus',
        prefix: '0.0',
        lowerBound: 0,
      },
      {
        type: 'p',
        prefix: '0.0.controllableAsset.3',
        lowerBound: -0.4166666666666667,
        upperBound: 0.8333333333333334,
      },
      {
        type: 'dSecondary',
        prefix: '0.0.controllableAsset.3',
        lowerBound: 0,
        upperBound: Infinity,
      },
    ],
    constraints: [
      {
        identifier: 'Slack objective bounding constraint',
        variables: [
          {
            type: 'dBus',
            prefix: '0',
            factor: 2400,
          },
          {
            type: 'dBus',
            prefix: '0.0',
            factor: 2400,
          },
        ],
        lowerBound: 0,
        upperBound: 1e-7,
      },
      {
        identifier: 'Nodal balance for node 0',
        variables: [
          {
            type: 'pExchange',
            prefix: '0',
            factor: 1,
          },
          {
            type: 'pSlack',
            prefix: '0',
            factor: -1,
          },
          {
            type: 'pExchange',
            prefix: '0.0',
            factor: -1,
          },
        ],
        lowerBound: -0.45681458333333336,
        upperBound: -0.45681458333333336,
      },
      {
        identifier: 'Positive nodal slack deviation constraint for node 0',
        variables: [
          {
            type: 'dBus',
            prefix: '0',
            factor: 1,
          },
          {
            type: 'pSlack',
            prefix: '0',
            factor: -1,
          },
        ],
        lowerBound: 0,
        upperBound: Infinity,
      },
      {
        identifier: 'Negative nodal slack deviation constraint for node 0',
        variables: [
          {
            type: 'dBus',
            prefix: '0',
            factor: 1,
          },
          {
            type: 'pSlack',
            prefix: '0',
            factor: 1,
          },
        ],
        lowerBound: 0,
        upperBound: Infinity,
      },
      {
        identifier: 'Nodal balance for node 0.0',
        variables: [
          {
            type: 'pExchange',
            prefix: '0.0',
            factor: 1,
          },
          {
            type: 'pSlack',
            prefix: '0.0',
            factor: -1,
          },
          {
            type: 'p',
            prefix: '0.0.controllableAsset.3',
            factor: -1,
          },
        ],
        lowerBound: -0.25564583333333335,
        upperBound: -0.25564583333333335,
      },
      {
        identifier: 'Positive nodal slack deviation constraint for node 0.0',
        variables: [
          {
            type: 'dBus',
            prefix: '0.0',
            factor: 1,
          },
          {
            type: 'pSlack',
            prefix: '0.0',
            factor: -1,
          },
        ],
        lowerBound: 0,
        upperBound: Infinity,
      },
      {
        identifier: 'Negative nodal slack deviation constraint for node 0.0',
        variables: [
          {
            type: 'dBus',
            prefix: '0.0',
            factor: 1,
          },
          {
            type: 'pSlack',
            prefix: '0.0',
            factor: 1,
          },
        ],
        lowerBound: 0,
        upperBound: Infinity,
      },
      {
        identifier: 'Ramp rate constraint for asset 0.0.controllableAsset.3',
        variables: [
          {
            type: 'p',
            prefix: '0.0.controllableAsset.3',
            factor: 1,
          },
        ],
        lowerBound: -0.08912374999999999,
        upperBound: -0.035357083333333324,
      },
      {
        identifier:
          'Upper secondary deviation constraint for asset 0.0.controllableAsset.3',
        variables: [
          {
            type: 'p',
            prefix: '0.0.controllableAsset.3',
            factor: 1,
          },
          {
            type: 'dSecondary',
            prefix: '0.0.controllableAsset.3',
            factor: -1,
          },
        ],
        lowerBound: -Infinity,
        upperBound: -0.08912374999999999,
      },
      {
        identifier:
          'Lower secondary deviation constraint for asset 0.0.controllableAsset.3',
        variables: [
          {
            type: 'p',
            prefix: '0.0.controllableAsset.3',
            factor: -1,
          },
          {
            type: 'dSecondary',
            prefix: '0.0.controllableAsset.3',
            factor: -1,
          },
        ],
        lowerBound: -Infinity,
        upperBound: 0.08912374999999999,
      },
    ],
  };
}
