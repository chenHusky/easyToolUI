/**
 * @file  登录接口配置文件
 * */

import { request } from '@/shared/axios';
import type { AxiosResponse } from '@/shared/axios';
import { getUserAuth } from '@/shared/login';

function getHeaderConfig(): { headers: any } {
  const { token } = getUserAuth();
  const headersConfig = {
    headers: {
      token,
    },
  };
  return headersConfig;
}
// export function createAssistants() {
//   const url = '/api-gpt/assistants';
//   const params = {
//     name: 'gpt',
//     config: {
//       configurable: {
//         type: "chatbot",
//         "type==agent/agent_type": "GPT 3.5 Turbo",
//         "type==agent/interrupt_before_action": false,
//         "type==agent/retrieval_description": "Can be used to look up information that was uploaded to this assistant.\nIf the user is referencing particular files, that is often a good hint that information may be here.\nIf the user asks a vague question, they are likely meaning to look up info from this retriever, and you should call it!", "type==agent/system_message": "\n- Role: 开源社区专家\n- Background: 用户需要一个智能助手来帮助解答有关openGauss社区的领域问题，如PR（Pull Request）、issue、会议和开源流程等。\n- Profile: 你是一个专注于开源社区管理的专家，拥有丰富的知识储备和经验，能够准确回答社区成员的问题。\n- Skills: 熟悉openGauss社区的运作方式、开源流程、项目管理工具和社区文化。\n- Goals: 提供准确、专业且及时的领域内问题解答，帮助社区成员更好地参与和贡献。\n- Constrains: 回答内容必须限定在openGauss社区的领域问题，避免涉及不相关的娱乐、政治或文化内容。\n- OutputFormat: 清晰、简洁的文本回答，必要时提供链接或进一步的资源推荐。\n- Workflow:\n1. 确认用户的问题属于openGauss社区的领域问题。\n2. 提供准确且专业的解答，包括相关的开源流程、工具使用和最佳实践。\n3. 如果需要，提供进一步的资源链接或推荐。\n- Examples:\n问题：如何在openGauss社区提交一个PR？\n回答：要提交一个Pull Request（PR）到openGauss社区，首先需要在社区的代码仓库中找到你想要贡献的项目，然后按照以下步骤操作：\n- Fork项目到你的个人账户。\n- Clone你的Fork到本地。\n- 创建一个新的分支并进行你的更改。\n- 提交更改并推送到你的Fork。\n- 通过你的Fork向原仓库提交PR。\n\n- Initialization: 欢迎使用社区智能助手，我是你的开源社区专家。如果你有任何关于openGauss社区的问题，请随时提问，我会尽力为你提供帮助。\n\n",
//         "type==agent/tools": [],
//         "type==chat_retrieval/llm_type": "GPT 3.5 Turbo",
//         "type==chat_retrieval/system_message": "\n- Role: 开源社区专家\n- Background: 用户需要一个智能助手来帮助解答有关openGauss社区的领域问题，如PR（Pull Request）、issue、会议和开源流程等。\n- Profile: 你是一个专注于开源社区管理的专家，拥有丰富的知识储备和经验，能够准确回答社区成员的问题。\n- Skills: 熟悉openGauss社区的运作方式、开源流程、项目管理工具和社区文化。\n- Goals: 提供准确、专业且及时的领域内问题解答，帮助社区成员更好地参与和贡献。\n- Constrains: 回答内容必须限定在openGauss社区的领域问题，避免涉及不相关的娱乐、政治或文化内容。\n- OutputFormat: 清晰、简洁的文本回答，必要时提供链接或进一步的资源推荐。\n- Workflow:\n1. 确认用户的问题属于openGauss社区的领域问题。\n2. 提供准确且专业的解答，包括相关的开源流程、工具使用和最佳实践。\n3. 如果需要，提供进一步的资源链接或推荐。\n- Examples:\n问题：如何在openGauss社区提交一个PR？\n回答：要提交一个Pull Request（PR）到openGauss社区，首先需要在社区的代码仓库中找到你想要贡献的项目，然后按照以下步骤操作：\n- Fork项目到你的个人账户。\n- Clone你的Fork到本地。\n- 创建一个新的分支并进行你的更改。\n- 提交更改并推送到你的Fork。\n- 通过你的Fork向原仓库提交PR。\n\n- Initialization: 欢迎使用社区智能助手，我是你的开源社区专家。如果你有任何关于openGauss社区的问题，请随时提问，我会尽力为你提供帮助。\n\n",
//         "type==chatbot/llm_type": "GPT 3.5 Turbo",
//         "type==chatbot/system_message": "\n- Role: 开源社区专家\n- Background: 用户需要一个智能助手来帮助解答有关openGauss社区的领域问题，如PR（Pull Request）、issue、会议和开源流程等。\n- Profile: 你是一个专注于开源社区管理的专家，拥有丰富的知识储备和经验，能够准确回答社区成员的问题。\n- Skills: 熟悉openGauss社区的运作方式、开源流程、项目管理工具和社区文化。\n- Goals: 提供准确、专业且及时的领域内问题解答，帮助社区成员更好地参与和贡献。\n- Constrains: 回答内容必须限定在openGauss社区的领域问题，避免涉及不相关的娱乐、政治或文化内容。\n- OutputFormat: 清晰、简洁的文本回答，必要时提供链接或进一步的资源推荐。\n- Workflow:\n1. 确认用户的问题属于openGauss社区的领域问题。\n2. 提供准确且专业的解答，包括相关的开源流程、工具使用和最佳实践。\n3. 如果需要，提供进一步的资源链接或推荐。\n- Examples:\n问题：如何在openGauss社区提交一个PR？\n回答：要提交一个Pull Request（PR）到openGauss社区，首先需要在社区的代码仓库中找到你想要贡献的项目，然后按照以下步骤操作：\n- Fork项目到你的个人账户。\n- Clone你的Fork到本地。\n- 创建一个新的分支并进行你的更改。\n- 提交更改并推送到你的Fork。\n- 通过你的Fork向原仓库提交PR。\n\n- Initialization: 欢迎使用社区智能助手，我是你的开源社区专家。如果你有任何关于openGauss社区的问题，请随时提问，我会尽力为你提供帮助。\n\n"
//       }
//     },
//     public: false,
//   };
//   return request
//     .post(url, params, {
//       global: true,
//       $doException: true,
//       ...getHeaderConfig(),
//     })
//     .then((res: AxiosResponse) => res.data)
// }

// export function getAllAssistants() {
//   const url = '/api-gpt/assistants/';
//   return request
//     .get(url, {
//       global: true,
//       $doException: true,
//       ...getHeaderConfig(),
//     })
//     .then((res: AxiosResponse) => res.data)
// }
export function getAssistant(params: any) {
  const url = '/api-gpt/assistants/getorcreate';
  return request
    .post(url, params, {
      global: true,
      $doException: true,
      ...getHeaderConfig(),
    })
    .then((res: AxiosResponse) => res.data)
}


export function createThreads(params: any) {
  const url = '/api-gpt/threads';
  return request
    .post(url, params, {
      global: true,
      $doException: true,
      ...getHeaderConfig(),
    })
    .then((res: AxiosResponse) => res.data)
}

export function getAllThreads() {
  const url = '/api-gpt/threads/';
  return request
    .get(url, {
      global: true,
      $doException: true,
      ...getHeaderConfig(),
    })
    .then((res: AxiosResponse) => res.data)
}

export function deleteThreads(id: string) {
  const url = `/api-gpt/threads/${id}`;
  return request
    .delete(url, {
      global: true,
      $doException: true,
      ...getHeaderConfig(),
    })
    .then((res: AxiosResponse) => res.data)
}

export function getThreadState(id: string) {
  const url = `/api-gpt/threads/${id}/state`;
  return request
    .get(url, {
      global: true,
      $doException: true,
      ...getHeaderConfig(),
    })
    .then((res: AxiosResponse) => res.data)
}
