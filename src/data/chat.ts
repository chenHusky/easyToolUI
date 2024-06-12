import meeting from '@/assets/images/map-meeting.png';
import pr from '@/assets/images/map-pr.png';
import contribution from '@/assets/images/map-contribution.png';
import sig from '@/assets/images/map-sig.png';
import data from '@/assets/images/map-data.png';

export const sceneChatList = [
    {
        title: '社区贡献',
        img: contribution,
    },
    {
        title: 'PR详情、PR Review',
        img: pr,
    },
    {
        title: 'SIG信息',
        img: sig,
    },
    {
        title: '社区数据',
        img: data,
    },
    {
        title: '会议查询以及预定',
        img: meeting,
    },
]
export const defaultChatList = [
    '签署CLA怎么签署',
    'Retriever检索opengauss社区技术委员会成员',
    'QA sig组最近3次会议是哪些',
    '查询社区有哪些SIG组',
]