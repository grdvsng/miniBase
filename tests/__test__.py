import unittest
from time import time as timestamp


class Polygon(unittest.TestCase):
    """
    Class help create fast unittests and format results on Human readable string.

    Attributes:
        testsCount (int): count of test.
        testClass  (class): class will testing
        testsHistory (diction): history of test running

    """

    def __init__(self):
        self.testsCount = 0
        self.testsHistory = {}


    def createTestClassExemplar(self, testClass, *args):
        """
        Create class To test exemplar

        Attributes:
            testClass (Class): class testing
            *args: testClass constructor params

        Returns:
            (void)
        """

        self.testClass = testClass(*args)

    def runTest(self, classMethod, testMethod, expectedResult, *args):
        """
        Test for testClass method

        Attributes:
            classMethod (string): class name of method to test
            testMethod (string): UnitTest name of method to use
            expectedResult (any=None): Expected Result from test(if void use None)
            *args: method on test params

        Returns:
            (void)

        Raises:
            ClassNotFound - testClass not created.

        """

        _meth   = getattr(self.testClass, testMethod)
        _test   = getattr(self, testMethod)
        _result = _meth(*args)

        _test(_result, expectedResult)


test = Polygon()
