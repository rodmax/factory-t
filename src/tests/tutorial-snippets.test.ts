import { factoryT, fields, factoryTBuilder } from 'factory-t';
import { describe, it, expect } from '@jest/globals';

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
                .setFieldFactory('name', (ctx) => `name-${ctx.inject('id')}`)
                .setFieldFactory('email', (ctx) => `${ctx.inject('name')}@g.com`)
                .factory();

            expect(userFactory.item({ id: 777 })).toStrictEqual({
                id: 777,
                name: 'name-777',
                email: 'name-777@g.com',
            });
        });
    });

    describe('generation objects', () => {
        it('list() examples', () => {
            interface User {
                id: number;
                name: string;
            }
            const userFactory = factoryT<User>({
                id: fields.index(),
                name: (ctx) => `name-${ctx.index}`,
            });

            expect(userFactory.list({ count: 2 })).toStrictEqual([
                { id: 1, name: 'name-1' },
                { id: 2, name: 'name-2' },
            ]);

            expect(userFactory.list({ partials: [{ id: 700 }, {}, { id: 900 }] })).toStrictEqual([
                { id: 700, name: 'name-3' },
                { id: 4, name: 'name-4' },
                { id: 900, name: 'name-5' },
            ]);

            expect(userFactory.list({ count: 2, partial: { name: 'custom-name' } })).toStrictEqual([
                { id: 6, name: 'custom-name' },
                { id: 7, name: 'custom-name' },
            ]);
        });
    });

    describe('.F.A.Q.', () => {
        it('base & extended factories', () => {
            interface BaseTask {
                id: number;
                priority: 'low' | 'middle' | 'high';
            }

            interface BugTask extends BaseTask {
                type: 'BUG';
                affectedVersion: string;
            }

            interface EpicTask extends BaseTask {
                type: 'EPIC';
                taskIds: Array<BaseTask['id']>;
            }

            const baseTaskFactoryBuilder = factoryTBuilder<BaseTask>({
                id: fields.index(),
                priority: 'high',
            });

            const butTaskFactory = baseTaskFactoryBuilder
                .inheritedBuilder<BugTask>({
                    type: 'BUG',
                    affectedVersion: '0.0.1',
                })
                .factory();

            const epicTaskFactory = baseTaskFactoryBuilder
                .inheritedBuilder<EpicTask>({
                    type: 'EPIC',
                    taskIds: [100, 500],
                })
                .factory();

            expect(butTaskFactory.item()).toStrictEqual({
                id: 1,
                type: 'BUG',
                priority: 'high',
                affectedVersion: '0.0.1',
            });

            expect(epicTaskFactory.item()).toStrictEqual({
                id: 1,
                type: 'EPIC',
                priority: 'high',
                taskIds: [100, 500],
            });
        });
        it('resetCount() example', () => {
            const factory = factoryT({ id: fields.index() });
            expect(factory.list({ count: 2 })).toStrictEqual([{ id: 1 }, { id: 2 }]);
            factory.resetCount();
            expect(factory.list({ count: 2 })).toStrictEqual([{ id: 1 }, { id: 2 }]);
        });
    });
});
