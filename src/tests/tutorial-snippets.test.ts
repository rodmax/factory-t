import { factoryT, fields, factoryTBuilder } from 'factory-t';

describe('docs/tutorial.md', () => {
    describe('create factory', () => {
        it('using config', () => {
            interface User {
                id: number;
                name: string;
            }
            const userFactory = factoryT<User>({
                id: fields.index(),
                name: 'Paul',
            });
            expect(userFactory.item()).toStrictEqual({
                id: 1,
                name: 'Paul',
            });
        });

        it('using factory builder', () => {
            interface User {
                id: number;
                email: string;
                name: string;
            }
            const userFactory = factoryTBuilder<User>({
                id: fields.index(),
                email: fields.string(),
                name: fields.string(),
            })
                .useFieldFactory('name', (ctx) => `name-${ctx.get('id')}`)
                .useFieldFactory('email', (ctx) => `${ctx.get('name')}@g.com`)
                .factory();

            expect(userFactory.item({ id: 777 })).toStrictEqual({
                id: 777,
                name: 'name-777',
                email: 'name-777@g.com',
            });
        });
    });
});
