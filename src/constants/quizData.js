export default [
	{
		id: 'challenge1',
		text: 'In the last 12 months, my household <strong>spent</strong>...',
		help: 'Consider all the money your household made and spent.',
		required: true,
		answers: [
			{
				id: '90ceb14f-e721-4c47-8653-9261be2d07fe',
				text: 'Much less than our income',
				score: 100,
			},
			{
				id: '49e7e23b-3a65-42f7-b11a-c80b77c3d41c',
				text: 'A little less than our income',
				score: 75,
			},
			{
				id: '04bb0296-0dfd-4d88-bdfa-1dc0e131033b',
				text: 'About equal to our income',
				score: 50,
			},
			{
				id: 'f0fd7bdb-fc99-44e2-83d6-3487721bb90d',
				text: 'A little more than our income',
				score: 25,
			},
			{
				id: 'd35bc6fc-3249-4a63-83de-90a40c23c995',
				text: 'Much more than our income',
				score: 0,
			},
		],
	},
	{
		id: 'challenge2',
		text: 'In the last 12 months, my household <strong>paid</strong>...',
		help: 'Consider all the bills your household had in the last year.',
		required: true,
		answers: [
			{
				id: 'b8edd90a-2914-4395-b10c-c4d3cd0a79f4',
				text: 'All bills on time',
				score: 100,
			},
			{
				id: 'b9e1440d-564c-4b55-ad59-d905bc2e47a1',
				text: 'Nearly all bills on time ',
				score: 60,
			},
			{
				id: 'b4872681-41d4-4c60-a981-3d20bd70b1f4',
				text: 'Most bills on time ',
				score: 40,
			},
			{
				id: 'd7a1c333-af85-4fcc-a2a8-52b47d71a582',
				text: 'Some bills on time ',
				score: 20,
			},
			{
				id: 'de97b2ad-eaee-4fbf-a502-db8c501f9d45',
				text: 'Very few bills on time',
				score: 0,
			},
		],
	},
	{
		id: 'challenge3',
		text: 'If our household stopped earning money, the cash we have now would support us for…',
		help: `
      <p>Imagine everyone in your household stopped making money.</p>
      <p>You couldn’t use your retirement accounts, or borrow money from anyone.</p>
      <p>All you had was what you have now in cash, checking, and savings accounts.</p>
      <p>If all your bills and spending stayed the same, how long before you couldn’t cover your spending?</p>
    `,
		required: true,
		answers: [
			{
				id: 'b7f693ac-bd36-409b-b6ee-779fbd6a4640',
				text: '6 months or more',
				score: 100,
			},
			{
				id: 'f6260bdc-f3be-4831-a6c1-58a191218e4e',
				text: '3-5 months',
				score: 75,
			},
			{
				id: '4d806737-3ba7-4032-bf8f-025cf784cab8',
				text: '1-2 months',
				score: 50,
			},
			{
				id: '90d144de-1790-43ac-8d0a-4a4bd56eaf88',
				text: '1-3 weeks',
				score: 25,
			},
			{
				id: '0c83df6b-3bdd-4748-8762-e08cf18d4761',
				text: 'Less than 1 week',
				score: 0,
			},
		],
	},
	{
		id: 'challenge4',
		text: 'My household is doing what’s needed to meet our long-term financial goals.',
		help: `
      <p>Example goals:</p>
      <ul>
        <li>saving for a vacation</li>
        <li>starting a business</li>
        <li>buying or paying off a home</li>
        <li>saving up for education</li>
        <li>putting money away for retirement</li>
        <li>or making retirement funds last</li>
      </ul>
      `,
		required: true,
		answers: [
			{
				id: '947a667a-865a-494e-b1ce-de589291f5f0',
				text: 'Very confident',
				score: 100,
			},
			{
				id: '0344d1a8-0b73-4cc7-9cb7-926c980d21ed',
				text: 'Moderately confident',
				score: 75,
			},
			{
				id: '1fe545c4-3628-4ce3-bea4-4479a5074c8b',
				text: 'Somewhat confident',
				score: 50,
			},
			{
				id: '50c2ef74-be8c-46d2-9e84-c8538f4246ac',
				text: 'Slightly confident',
				score: 25,
			},
			{
				id: 'b95b79a6-5dc8-4bd0-a0dd-f60fc165a8be',
				text: 'Not at all confident',
				score: 0,
			},
		],
	},
	{
		id: 'age',
		text: 'What is your age?',
		required: false,
		answers: [
			{ id: 'a0da6056-435c-4177-9671-b26e20673e31', text: '18-25' },
			{ id: '3163f045-ff47-49ed-8ab4-ec8b5687a0c1', text: '26-35' },
			{ id: '5cb25fd7-f378-48b4-9092-6037e20cc11d', text: '36-49' },
			{ id: '32830bca-ae0e-494e-b636-0d66a8a15db5', text: '50-64' },
			{ id: 'a497c0a1-0dbc-4232-8b31-e599d0735e67', text: '65 and over' },
		],
	},
	{
		id: 'education',
		text: 'What is your education level?',
		required: true,
		answers: [
			{
				id: '1348dcf6-e4f6-4087-b0c0-c5e54ee79416',
				text: "Bachelor's degree or higher",
			},
			{ id: 'dd78bce1-ae3f-4166-aa04-f3fb1318ca1f', text: 'Some college' },
			{ id: '9e8cf95c-b1b7-451b-a1a8-fb2ae086d9b9', text: 'High school' },
			{
				id: '8db989f6-2b9c-49bc-ad56-9163a29633fe',
				text: 'Less than high school',
			},
		],
	},
	{
		id: 'income',
		text: 'What is your approximate annual household income?',
		required: false,
		answers: [
			{ id: 'dd99cf75-4cb1-4473-b824-f6f4bcdba77d', text: '$100,000 or more' },
			{ id: '50050f6c-2421-40a5-ab0e-dc4c1ae5abba', text: '$60,000 - $99,999' },
			{ id: '75b487a3-7de9-4868-8836-bdf50b2d2f63', text: '$30,000 - $59,999' },
			{ id: 'a5460cd0-3c8b-4b8e-8dcc-040fc80f111e', text: 'Less than $30,000' },
		],
	},
];
