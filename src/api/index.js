import {
	version
} from '../../package.json';
import {
	Router
} from 'express';
import facets from './facets';

export default ({
	config,
	db
}) => {
	let api = Router();

	let messages = new Object({
		authentication: {
			form: {
				steps: {
					one: {
						title: 'Base Informations',
					},
					two: {
						title: 'Personal Informations',
					}
				}
			},
			email: {
				label: "E-mail",
				placeholder: 'Wpisz imię...'
			},
			name: {
				label: "Nazwa",
				placeholder: 'Wpisz nazwę...'
			},
			password: {
				label: "Hasło",
				placeholder: 'Wpisz hasło...',
				tooltip: 'Przykładowy tooltip'

			},
			displayName: {
				label: "Widoczna nazwa",
				placeholder: 'Wpisz widoczną nazwę...'
			},
			adult: {
				label: 'Oświadczenie',
			},
			agreement: {
				label: 'Oświadczenie',
			},
			firstName: {
				label: 'Imię',
				placeholder: 'Wpisz imię...'
			}
		}
	});

	let users = new Object([
		{
			name: 'uland',
			displayName: 'Uland Nimblehoof',
			email: 'uland@gmail.com',
			adult: true
		},
		{
			name: 'okyl',
			displayName: 'Okyl Bjornsen',
			email: 'okyl@gmail.com',
			adult: false
		},
		{
			name: 'malcom',
			displayName: 'Malcom Freeman',
			email: 'uland@gmail.com',
			adult: true

		}
	]);

	let newUsers = new Object([
		{
			id: 1,
			name: 'uland',
			displayName: 'Uland Nimblehoof',
			email: 'uland@gmail.com',
			adult: true
		},
		{
			id: 2,
			name: 'okyl',
			displayName: 'Okyl Bjornsen',
			email: 'okyl@gmail.com',
			adult: false
		},
		{
			id: 3,
			name: 'malcom',
			displayName: 'Malcom Freeman',
			email: 'malcom@gmail.com',
			adult: true
		}
	]);

	// mount the facets resource
	api.use('/facets', facets({
		config,
		db
	}));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({
			version
		});
	});

	api.get('/users', (req, res) => res.json(users));
	api.get('/messages', (req, res) => {
		res.json(JSON.stringify(messages));
	});

	api.get('reduxList', (req, res) => {
		res.send('Working')
	});
	api.get('/getUsers', (req, res) => {
		console.log(JSON.stringify(newUsers));
		res.json(JSON.stringify(newUsers))
	});

	api.post('/updateUser', (req, res) => {
		console.log(req.body);
		
	});

	return api;
}