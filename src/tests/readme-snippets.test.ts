import { factoryT, indexField, sequenceField, nullableField, optionalField } from 'factory-t';

describe('examples:README', () => {
    it('introduction example', () => {
        interface UserDto {
            id: number;
            email: string;
            phone: string | null;
            profile: {
                avatarUrl: string;
                language: 'EN' | 'RU';
                statusString?: string;
            };
        }

        const profileFactory = factoryT<UserDto['profile']>({
            avatarUrl: 'my.site/avatar',
            language: sequenceField(['EN', 'RU']),
            statusString: optionalField('sleeping'),
        });

        const userFactory = factoryT<UserDto>({
            id: indexField(),
            email: (ctx) => `user-${ctx.index}@g.com`,
            phone: nullableField('+127788'),
            profile: (ctx) => profileFactory.item({ avatarUrl: `/avatars/${ctx.index}` }),
        });

        expect(userFactory.item({ phone: null })).toStrictEqual({
            id: 1,
            email: 'user-1@g.com',
            phone: null, // override by passed partial to item(...)
            profile: {
                avatarUrl: '/avatars/1', // override by userFactory using its index
                language: 'EN',
                statusString: 'sleeping',
            },
        });
    });
});
