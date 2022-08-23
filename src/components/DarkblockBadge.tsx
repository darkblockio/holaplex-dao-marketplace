import { FC } from 'react';
import { Tooltip } from 'antd';

const text =
`This NFT includes locked
content powered by the
Darkblock`;

export const DarkblockBadge: FC = () => {
  return (
    <Tooltip
      placement="top"
      mouseEnterDelay={0.09}
      overlayStyle={{
        fontSize: '0.75rem',
        fontWeight: 600,
        color: 'white',
      }}
      title={text}>
      <div
        data-tooltip-target="tooltip-default"
        className='flex items-center justify-around h-6 px-2 text-xs font-medium bg-gray-900 bg-opacity-50 rounded-full '
        style={{backdropFilter: 'blur(10px)'}}>
        <img
          src={'/images/footericon-blk.svg'}
          alt={'Darkblock'}
          className="w-3 h-3 mr-2"
        />
        Darkblock
      </div>
    </Tooltip>
  )
}
