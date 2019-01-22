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


	/*
	{
		"lang": {
			"extension": {
				"feature": {
					"intention": {
						[...]
					}
				} 
			},
			"controls": {
				[...]
			}
		}
	}
	*/

	let messages = new Object({
		en: {
			main: {
				header: {
					title: "Application Managment System",
					subtitle: "Powered by {{ value }}",
					language: {
						select: {
							label: "Change country",
							placeholder: "Select...",
						}
					}
				},
				footer: {
					text: "AMS | Alior Bank"
				}
			},
			test: "translation tests",
			development: {
				registerStepper: {
					primaryData: {
						title: "Client Contact Data"
					},
					extendedData: {
						title: "Client Personal Data"
					},
					additionalData: {
						title: "Client Additional Data"
					}
				}
			},
			formControls: {
				default: {

				},
				email: {
					label: "E-mail",
					placeholder: 'Enter email...'
				},
				name: {
					label: "Name",
					placeholder: 'Enter name...'
				},
				password: {
					label: "Password",
					placeholder: 'Enter passpharase...',
					tooltip: 'Example tooltip'
	
				},
				date: {
					label: "Date",
					placeholder: 'Pick date...'
				},
				displayName: {
					label: "Display Name",
					placeholder: 'Wpisz widoczną nazwę...',
					extPlaceholder: {value: 'Wpisz widoczną nazwę...'}
				},
				adult: {
					label: 'Yes, I am over 21 years old',
				},
				agreement: {
					label: 'Agreement',
				},
				firstName: {
					label: 'First Name',
					placeholder: 'Enter first name...'
				}
			}
		},
		pl: {
			main: {
				header: {
					title: "System zarządzania aplikacjami",
					subtitle: "Napędzany przez {{ value }}",
					language: {
						select: {
							label: "Zmień kraj",
							placeholder: "Wybierz...",
						}
					}
				},
				footer: {
					text: "AMS | Alior Bank"
				}
			},
			test: "testy tłumaczeń",
			development: {
				registerStepper: {
					primaryData: {
						title: "Dane Kontaktowe"
					},
					extendedData: {
						title: "Dane Personalne"
					},
					additionalData: {
						title: "Dane Uzupełniające"
					}
				}
			},
			formControls: {
				default: {
	
				},
				email: {
					label: "E-mail",
					placeholder: 'Wpisz email...'
				},
				name: {
					label: "Nazwa",
					placeholder: 'Wpisz name...'
				},
				password: {
					label: "Hasło",
					placeholder: 'Wpisz hasło...',
					tooltip: 'Przykładowy tooltip'
	
				},
				date: {
					label: "Data",
					placeholder: 'Wybierz datę...'
				},
				displayName: {
					label: "Widoczna Nazwa",
					placeholder: 'Wpisz widoczną nazwę...'
				},
				adult: {
					label: 'Tak, ukoczyłem 18 lat',
				},
				agreement: {
					label: 'Oświadczenie',
				},
				firstName: {
					label: 'Imię',
					placeholder: 'Wpisz imię...'
				},
				lastName: {
					label: 'Nazwisko',
					placeholder: 'Wpisz nazwisko...'
				}
			}
		}
	});

	let users = new Object([
		{
			id: "1",
			name: 'uland',
			displayName: 'Uland Nimblehoof',
			email: 'uland@gmail.com',
			adult: true
		},
		{
			id: "2",
			name: 'okyl',
			displayName: 'Okyl Bjornsen',
			email: 'okyl@gmail.com',
			adult: false
		},
		{
			id: "3",
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

	api.get('/messages', (req, res) => {
		res.json(JSON.stringify(messages));
	});

	api.get('/messages/pl', (req, res) => {
		res.json(JSON.stringify(messages.pl));
	});

	api.get('/messages/en', (req, res) => {
		res.json(JSON.stringify(messages.en));
	});

	api.get('/getUsers', (req, res) => {
		console.log(users);
		res.json(JSON.stringify(users));
	});

	api.post('/updateUser', (req, res) => {
		let updatedUser = users.find(user => user.id === req.body.id);
		updatedUser.adult = req.body.value;
		console.log(req.body, '\r updated: ', updatedUser);
		res.json(JSON.stringify(updatedUser));
	});

	return api;
}