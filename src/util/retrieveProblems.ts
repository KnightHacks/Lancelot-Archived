/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios, { AxiosResponse } from 'axios';
import {
  Problem,
  ProblemInfo,
  Topic,
  SimilarProblemInfo,
  Difficulty,
} from './problemTypes';

interface ProblemResponse {
  stat_status_pairs: ProblemData[];
}

interface ProblemData {
  stat: ProblemStats;
  paid_only: boolean;
  difficulty: ProblemDifficulty;
}

interface ProblemStats {
  question_hide: boolean;
  question__title: string;
  question__title_slug: string;
  total_submitted: number;
  total_acs: number;
  frontend_question_id: number;
}

interface ProblemDifficulty {
  level: number;
}

const shuffle = (array: object[]) => {
  let currentIndex: number = array.length,
    randomIndex: number;

  // While there remain elements to shuffle
  while (currentIndex !== 0) {
    // Pick a remaining element
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    const temp = array[currentIndex];
    array[currentIndex] = array[randomIndex]!;
    array[randomIndex] = temp!;
  }

  return array;
};

export const getAllProblems = async (): Promise<Problem[][]> => {
  return axios
    .get<ProblemResponse>('https://leetcode.com/api/problems/algorithms/')
    .then((response) => {
      const problems = response.data.stat_status_pairs;
      const easyProblems: Problem[] = [],
        mediumProblems: Problem[] = [],
        hardProblems: Problem[] = [];

      for (const prob of problems) {
        // If we can't get a problem for everyone, throw it away
        if (prob.stat.question_hide || prob.paid_only) continue;

        const pushTo =
          prob.difficulty.level === Difficulty.EASY
            ? easyProblems
            : prob.difficulty.level === Difficulty.MEDIUM
            ? mediumProblems
            : hardProblems;

        const newProbObj = {
          name: prob.stat.question__title
            ? prob.stat.question__title
            : 'Name Unavailable',
          slug: prob.stat.question__title_slug
            ? prob.stat.question__title_slug
            : 'slug-unavailable',
          numAttempts: prob.stat.total_submitted
            ? prob.stat.total_submitted
            : 0,
          numAccepts: prob.stat.total_acs ? prob.stat.total_acs : 0,
          difficulty: prob.difficulty.level
            ? prob.difficulty.level
            : Difficulty.NONE,
          URL: `https://leetcode.com/problems/${prob.stat.question__title_slug}/`,
          id: prob.stat.frontend_question_id
            ? prob.stat.frontend_question_id
            : 0,
        };

        pushTo.push(newProbObj);
      }

      shuffle(easyProblems);
      shuffle(mediumProblems);
      shuffle(hardProblems);

      return [easyProblems, mediumProblems, hardProblems];
    })
    .catch(() => {
      return [];
    });

  /*
	response.data: Return object structure and useful fields
	{
		num_total: number,
		stat_status_pairs: [
			{
				stat: {
					frontend_question_id: number 1-...,
					question_hide: true/false,
					question__title: "Something Something"
					question_title_slug: "something-something", // https://leetcode.com/problems/question_title_slug/
					total_submitted: number,
					total_acs: number,

				},
				difficulty: {
					level: 1-3
				},
				paid_only: true/false,
				...
			},
			...
		]
	}
	*/
};

interface ProblemInfoResponse {
  data: InfoResponseData;
}

interface InfoResponseData {
  question: QuestionData;
}

interface QuestionData {
  likes: number;
  dislikes: number;
  htmlContent: string;
  similarQuestions: string;
  topicTags: TagData[];
  content: string;
}

interface TagData {
  name: string;
  slug: string;
}

interface InfoRequest {
  operationName: string;
  query: string;
  variables: object;
}

export const getAdditionalProblemInfo = async (
  problem: Problem
): Promise<ProblemInfo> => {
  const response = await axios.post<
    InfoRequest,
    AxiosResponse<ProblemInfoResponse>
  >('https://leetcode.com/graphql', {
    operationName: 'questionData',
    query:
      'query questionData($titleSlug: String!) {\n  question(titleSlug: $titleSlug) {\n    questionId\n    questionFrontendId\n    boundTopicId\n    title\n    titleSlug\n    content\n    translatedTitle\n    translatedContent\n    isPaidOnly\n    difficulty\n    likes\n    dislikes\n    isLiked\n    similarQuestions\n    exampleTestcases\n    contributors {\n      username\n      profileUrl\n      avatarUrl\n      __typename\n    }\n    topicTags {\n      name\n      slug\n      translatedName\n      __typename\n    }\n    companyTagStats\n    codeSnippets {\n      lang\n      langSlug\n      code\n      __typename\n    }\n    stats\n    hints\n    solution {\n      id\n      canSeeDetail\n      paidOnly\n      hasVideoSolution\n      paidOnlyVideo\n      __typename\n    }\n    status\n    sampleTestCase\n    metaData\n    judgerAvailable\n    judgeType\n    mysqlSchemas\n    enableRunCode\n    enableTestMode\n    enableDebugger\n    envInfo\n    libraryUrl\n    adminUrl\n    __typename\n  }\n}\n',
    variables: {
      titleSlug: problem.slug,
    },
  });

  const questionData = response.data.data.question;

  let similarQuestionsArray: SimilarProblemInfo[] = [];
  const simQsString = questionData.similarQuestions
    ? questionData.similarQuestions
    : '[]';
  if (simQsString && simQsString !== '[]') {
    // There are topics to parse
    // Remove [], then split the objects
    // Need to add a unique separator, splitting by commas messes up the objects
    const tempStrArray = simQsString
      .substring(1, simQsString.length - 1)
      .replace(/}, /g, '}||')
      .split('||');

    similarQuestionsArray = tempStrArray.map((str: string) => {
      const parsedObj = JSON.parse(str);
      return {
        name: parsedObj.title,
        slug: parsedObj.titleSlug,
        difficulty: parsedObj.difficulty,
        url: `https://leetcode.com/problems/${parsedObj.titleSlug}/`,
      };
    });
  }

  const topicTags = questionData.topicTags ? questionData.topicTags : [];
  const topicsArray: Topic[] = topicTags.map((tagObj: TagData) => {
    return {
      name: tagObj.name,
      slug: tagObj.slug,
      url: `https://leetcode.com/tag/${tagObj.slug}/`,
    };
  });

  const ret = {
    likes: questionData.likes ? questionData.likes : 0,
    dislikes: questionData.dislikes ? questionData.dislikes : 0,
    htmlContent: questionData.content ? questionData.content : '',
    similarQuestions: similarQuestionsArray,
    topics: topicsArray,
  };

  return ret;

  /*
	From main graphql query, since the rest don't seem to have any general information that would be helpful without a cookie

	data: {
		question: {
			content: html,
			likes: number,
			dislikes: number,
			topicTags: [
				{
					name: "Something Something",
					slug: "something-something" // To load more of the tag, go to leetcode.com/tag/slug
				},
				...
			]
			similarQuestions: string,
			
			Format for similarQuestions:
			"[{\"title\": \"Multiply Strings\", \"titleSlug\": \"multiply-strings\", \"difficulty\": \"Medium\", \"translatedTitle\": null}, {\"title\": \"Add Binary\", \"titleSlug\": \"add-binary\", \"difficulty\": \"Easy\", \"translatedTitle\": null}, {\"title\": \"Sum of Two Integers\", \"titleSlug\": \"sum-of-two-integers\", \"difficulty\": \"Medium\", \"translatedTitle\": null}, {\"title\": \"Add Strings\", \"titleSlug\": \"add-strings\", \"difficulty\": \"Easy\", \"translatedTitle\": null}, {\"title\": \"Add Two Numbers II\", \"titleSlug\": \"add-two-numbers-ii\", \"difficulty\": \"Medium\", \"translatedTitle\": null}, {\"title\": \"Add to Array-Form of Integer\", \"titleSlug\": \"add-to-array-form-of-integer\", \"difficulty\": \"Easy\", \"translatedTitle\": null}, {\"title\": \"Add Two Polynomials Represented as Linked Lists\", \"titleSlug\": \"add-two-polynomials-represented-as-linked-lists\", \"difficulty\": \"Medium\", \"translatedTitle\": null}]"
			"[]" if no similar questions
		}
	}

	*/
};
