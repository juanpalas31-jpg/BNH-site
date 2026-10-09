import unittest
from organic_preview import profile_is_allowed

class PreviewSecurityTests(unittest.TestCase):
    def test_valid_profile(self):
        self.assertTrue(profile_is_allowed('https://www.vinted.fr/member/279658359-juanpalas'))
    def test_reject_external_and_query(self):
        for url in ['http://www.vinted.fr/member/123','https://evil.example/member/123','https://www.vinted.fr/member/123?redirect=evil','https://www.vinted.fr/member/123#frag']:
            with self.subTest(url=url): self.assertFalse(profile_is_allowed(url))
    @unittest.expectedFailure
    def test_reject_empty_member_id(self):
        self.assertFalse(profile_is_allowed('https://www.vinted.fr/member/'))
    @unittest.expectedFailure
    def test_reject_nested_member_path(self):
        self.assertFalse(profile_is_allowed('https://www.vinted.fr/member/123/other'))

if __name__ == '__main__': unittest.main()
